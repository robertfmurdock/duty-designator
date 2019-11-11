package test

import (
	"bytes"
	"duty-designator/server/internal"
	"encoding/json"
	"fmt"
	"github.com/google/go-cmp/cmp"
	"net/http"
	"net/http/httptest"
)

func performRequest(method string, url string, body interface{}) (*httptest.ResponseRecorder, error) {
	request, responseRecorder, err := buildRequest(method, url, body)
	if err != nil {
		return nil, err
	}
	sendToEndpoint(responseRecorder, request)
	return responseRecorder, nil
}

func performPutCorral(corralToPut map[string]interface{}) error {
	responseRecorder, err := performRequest(http.MethodPut, fmt.Sprintf("/api/corral/%s", corralToPut["date"]), corralToPut)
	if err != nil {
		return err
	}
	return verifySuccessfulRequest(responseRecorder)
}

func performDeleteCorral(date string) error {
	responseRecorder, err := performRequest(http.MethodDelete, fmt.Sprintf("/api/corral/%s", date), nil)
	if err != nil {
		return err
	}
	return verifySuccessfulRequest(responseRecorder)
}

func performPostPioneer(pioneerToPost map[string]string) error {
	responseRecorder, err := performRequest(http.MethodPost, "/api/pioneer", pioneerToPost)
	if err != nil {
		return err
	}
	return verifySuccessfulRequest(responseRecorder)
}

func performGetPioneerRequest() ([]map[string]string, error) {
	responseRecorder, err := performRequest(http.MethodGet, "/api/pioneer", nil)
	if err != nil {
		return nil, err
	}
	if err := verifySuccessfulRequest(responseRecorder); err != nil {
		return nil, err
	}
	return parseBodyAsJsonArray(responseRecorder)
}

func performGetPioneerById(pioneerID string) (map[string]string, error) {
	responseRecorder, err := performRequest(http.MethodGet, "/api/pioneer/"+pioneerID, nil)
	if err != nil {
		return nil, err
	}
	if err := verifySuccessfulRequest(responseRecorder); err != nil {
		return nil, err
	}
	return parseBodyAsJson(responseRecorder)
}

func performDeletePioneerById(pioneerID string) (int, error) {
	responseRecorder, err := performRequest(http.MethodDelete, "/api/pioneer/"+pioneerID, nil)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	if err := verifySuccessfulRequest(responseRecorder); err != nil {
		return http.StatusInternalServerError, err
	}
	return responseRecorder.Code, nil
}

func buildRequest(method string, url string, body interface{}) (*http.Request, *httptest.ResponseRecorder, error) {
	rawPioneer, err := json.Marshal(body)
	if err != nil {
		return nil, nil, fmt.Errorf("could not marshal json struct: %w", err)
	}
	req, err := http.NewRequest(method, url, bytes.NewReader(rawPioneer))
	if err != nil {
		return nil, nil, fmt.Errorf("could not construct request: %w", err)
	}
	responseRecorder := httptest.NewRecorder()
	return req, responseRecorder, err
}

var endpointMux = internal.NewChoreWheelMux(&internal.ServerConfig{ClientPath: "../../client/build"})

func sendToEndpoint(recorder *httptest.ResponseRecorder, request *http.Request) {
	endpointMux.ServeHTTP(recorder, request)
}

func parseBodyAsJsonArray(recorder *httptest.ResponseRecorder) ([]map[string]string, error) {
	var actualResponseBody []map[string]string
	if err := json.Unmarshal(recorder.Body.Bytes(), &actualResponseBody); err != nil {
		return nil, fmt.Errorf("could not parse server results: %w", err)
	}
	return actualResponseBody, nil
}

func parseBodyAsJson(recorder *httptest.ResponseRecorder) (map[string]string, error) {
	var actualResponseBody map[string]string
	if err := json.Unmarshal(recorder.Body.Bytes(), &actualResponseBody); err != nil {
		return nil, fmt.Errorf("could not parse server results: %w", err)
	}
	return actualResponseBody, nil
}

func verifySuccessfulRequest(recorder *httptest.ResponseRecorder) error {
	if recorder.Code != 200 {
		return fmt.Errorf("request was not successful: %v %v", recorder.Code, recorder.Body.String())
	}
	return nil
}

func verifyNotFound(recorder *httptest.ResponseRecorder) error {
	if recorder.Code != 404 {
		return fmt.Errorf("request should have been 404 but was: %v %v", recorder.Code, recorder.Body.String())
	}
	return nil
}

func performGetChores() ([]map[string]string, error) {
	responseRecorder, err := performRequest(http.MethodGet, "/api/chore", nil)
	if err != nil {
		return nil, err
	}
	if err := verifySuccessfulRequest(responseRecorder); err != nil {
		return nil, err
	}
	return parseBodyAsJsonArray(responseRecorder)
}

func performPostChore(newChore map[string]string) error {
	responseRecorder, err := performRequest(http.MethodPost, "/api/chore", newChore)
	if err != nil {
		return err
	}
	return verifySuccessfulRequest(responseRecorder)
}

func jsonArrayContains(s []map[string]string, e map[string]string) bool {
	for _, a := range s {
		if cmp.Equal(a, e) {
			return true
		}
	}
	return false
}

func performGetCorralRequest(date string) (*map[string]interface{}, error) {
	responseRecorder, err := performRequest(http.MethodGet, fmt.Sprintf("/api/corral/%s", date), nil)
	if err != nil {
		return nil, err
	}
	if err := verifySuccessfulRequest(responseRecorder); err != nil {
		return nil, err
	}

	var actualResponseBody map[string]interface{}
	if err := json.Unmarshal(responseRecorder.Body.Bytes(), &actualResponseBody); err != nil {
		return nil, fmt.Errorf("could not parse server results: %w, %s", err, responseRecorder.Body.Bytes())
	}
	return &actualResponseBody, nil
}

func performDeleteChoreById(choreID string) (int, error) {
	if responseRecorder, err := performRequest(http.MethodDelete, "/api/chore/"+choreID, nil); err != nil {
		return http.StatusInternalServerError, err
	} else if err := verifySuccessfulRequest(responseRecorder); err != nil {
		return http.StatusInternalServerError, err
	} else {
		return responseRecorder.Code, nil
	}
}

func performRosterPut(roster map[string]interface{}) error {
	responseRecorder, err := performRequest(http.MethodPut, fmt.Sprintf("/api/roster/%s", roster["date"]), roster)
	if err != nil {
		return err
	}
	return verifySuccessfulRequest(responseRecorder)
}

func performRosterGet(date string) (map[string]interface{}, error) {
	responseRecorder, err := performRequest(http.MethodGet, fmt.Sprintf("/api/roster/%s", date), nil)
	if err != nil {
		return nil, err
	}
	if err := verifySuccessfulRequest(responseRecorder); err != nil {
		return nil, err
	}

	var actualResponseBody map[string]interface{}
	if err := json.Unmarshal(responseRecorder.Body.Bytes(), &actualResponseBody); err != nil {
		return nil, fmt.Errorf("could not parse server results: %w, %s", err, responseRecorder.Body.Bytes())
	}
	return actualResponseBody, nil
}
