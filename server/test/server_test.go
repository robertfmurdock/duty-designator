package test

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

import "duty-designator/server/src"

func TestGetCandidatesHandler_ReturnsCandidate(t *testing.T) {
	req, err := http.NewRequest("GET", "/candidates ", nil)
	if err != nil {
		t.Fatal(err)
	}

	responseRecorder := httptest.NewRecorder()
	handler := http.HandlerFunc(src.GetCandidatesHandler)

	handler.ServeHTTP(responseRecorder, req)

	if responseRecorder.Body.String() != "HI" {
		t.Fail();
	}
}