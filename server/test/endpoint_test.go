package test

import (
	"bytes"
	"duty-designator/server/internal"
	"encoding/json"
	"github.com/google/go-cmp/cmp"
	"github.com/google/uuid"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestPostPioneerHandler_AfterPostCanGetInformationFromGet(t *testing.T) {
	pioneerToPOST := map[string]string{"name": "Alice", "id": uuid.New().String()}

	if err := performPostPioneer(pioneerToPOST, t); err != nil {
		t.Errorf("Post Pioneer Request failed. %v", err)
		return
	}

	pioneerRecords, err := performGetPioneerRequest(t)
	if err != nil {
		t.Errorf("Get Pioneer Request failed. %v", err)
		return
	}

	if !contains(pioneerRecords, pioneerToPOST) {
		t.Errorf("Slice %v\n did not contain: %v", pioneerRecords, pioneerToPOST)
	}
}

func performPostPioneer(pioneerToPost map[string]string, t *testing.T) error {
	request, responseRecorder, err := buildRequest(http.MethodPost, "/api/pioneer", pioneerToPost, t)
	if err != nil {
		return err
	}

	sendToEndpoint(responseRecorder, request)

	verifySuccessfulRequest(responseRecorder, t)
	return nil
}

func sendToEndpoint(recorder *httptest.ResponseRecorder, request *http.Request) {
	internal.ServeMux.ServeHTTP(recorder, request)
}

func verifySuccessfulRequest(recorder *httptest.ResponseRecorder, t *testing.T) {
	if recorder.Code != 200 {
		t.Error("Post was not successful", recorder.Body.String())
	}
}

func buildRequest(method string, url string, body map[string]string, t *testing.T) (*http.Request, *httptest.ResponseRecorder, error) {
	rawPioneer, err := json.Marshal(body)
	if err != nil {
		t.Error("Could not marshal json struct")
		return nil, nil, err
	}
	req, err := http.NewRequest(method, url, bytes.NewReader(rawPioneer))
	if err != nil {
		t.Error("Could not construct request")
		return nil, nil, err
	}
	responseRecorder := httptest.NewRecorder()
	return req, responseRecorder, err
}

func performGetPioneerRequest(t *testing.T) ([]map[string]string, error) {
	responseRecorder := httptest.NewRecorder()
	request, err := http.NewRequest(http.MethodGet, "/api/pioneer", nil)
	if err != nil {
		t.Error("Could not build get request.")
		return nil, err
	}
	internal.ServeMux.ServeHTTP(responseRecorder, request)

	var actualResponseBody []map[string]string
	if err := json.Unmarshal(responseRecorder.Body.Bytes(), &actualResponseBody); err != nil {
		t.Error("Could not parse server results.")
	}

	return actualResponseBody, nil
}

func TestPostChore_WillWorkWithGetChore(t *testing.T) {
	chore := map[string]string{
		"name":        "Compiled Cans",
		"id":          uuid.New().String(),
		"description": "Bruce knows how to can can",
		"title":       "Canner",
	}

	if err := performPostChore(chore); err != nil {
		t.Errorf("Post Chore Request failed. %v", err)
		return
	}

	responseJson, err := performGetChores(t)
	if err != nil {
		t.Errorf("Get Chore Request failed. %v", err)
		return
	}

	if !contains(responseJson, chore) {
		t.Errorf("List %v, did not contain %v", responseJson, chore)
	}
}

func performGetChores(t *testing.T) ([]map[string]string, error) {
	getRequest, _ := http.NewRequest(http.MethodGet, "/api/chore", nil)
	getRecorder := httptest.NewRecorder()
	internal.ServeMux.ServeHTTP(getRecorder, getRequest)
	var responseJson []map[string]string
	if err := json.Unmarshal(getRecorder.Body.Bytes(), &responseJson); err != nil {
		t.Error("Could not parse server results.")
		return nil, err
	}
	return responseJson, nil
}

func performPostChore(newChore map[string]string) error {
	choreJSON, err := json.Marshal(newChore)
	if err != nil {
		return err
	}

	request, err := http.NewRequest(http.MethodPost, "/api/chore", bytes.NewReader(choreJSON))
	if err != nil {
		return err
	}
	internal.ServeMux.ServeHTTP(httptest.NewRecorder(), request)
	return nil
}

func contains(s []map[string]string, e map[string]string) bool {
	for _, a := range s {
		if cmp.Equal(a, e) {
			return true
		}
	}
	return false
}
