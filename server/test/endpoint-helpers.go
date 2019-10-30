package test

import (
	"bytes"
	"duty-designator/server/internal"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func performRequest(method string, url string, body map[string]string, t *testing.T) (*httptest.ResponseRecorder, error) {
	request, responseRecorder, err := buildRequest(method, url, body, t)
	if err != nil {
		return nil, err
	}
	sendToEndpoint(responseRecorder, request)
	return responseRecorder, nil
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

func sendToEndpoint(recorder *httptest.ResponseRecorder, request *http.Request) {
	internal.ServeMux.ServeHTTP(recorder, request)
}

func verifySuccessfulRequest(recorder *httptest.ResponseRecorder, t *testing.T) {
	if recorder.Code != 200 {
		t.Error("Post was not successful", recorder.Body.String())
	}
}

func parseBodyAsJson(recorder *httptest.ResponseRecorder, t *testing.T) ([]map[string]string, error) {
	var actualResponseBody []map[string]string
	if err := json.Unmarshal(recorder.Body.Bytes(), &actualResponseBody); err != nil {
		t.Error("Could not parse server results.")
	}
	return actualResponseBody, nil
}
