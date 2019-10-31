package test

import (
	"bytes"
	"duty-designator/server/internal"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
)

func performRequest(method string, url string, body map[string]string) (*httptest.ResponseRecorder, error) {
	request, responseRecorder, err := buildRequest(method, url, body)
	if err != nil {
		return nil, err
	}
	sendToEndpoint(responseRecorder, request)
	return responseRecorder, nil
}

func buildRequest(method string, url string, body map[string]string) (*http.Request, *httptest.ResponseRecorder, error) {
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

func parseBodyAsJson(recorder *httptest.ResponseRecorder) ([]map[string]string, error) {
	var actualResponseBody []map[string]string
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
