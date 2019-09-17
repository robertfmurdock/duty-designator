package test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

import "duty-designator/server/src"

func TestGetCandidatesHandler_ReturnsCandidateJson(t *testing.T) {
	req, err := http.NewRequest("GET", "/candidates ", nil)
	if err != nil {
		t.Fatal(err)
	}

	responseRecorder := httptest.NewRecorder()
	handler := http.HandlerFunc(src.GetTaskAssignmentsHandler)

	handler.ServeHTTP(responseRecorder, req)

	var rows []src.Row
	rows = append(rows, src.Row{Candidate:"bob", Task:"dishes"} )
	jsonBytes, _ := json.Marshal(rows)
	if responseRecorder.Body.String() != string(jsonBytes) {
		t.Fail()
	}
}