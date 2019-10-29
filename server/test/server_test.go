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
	rawPioneer, e := json.Marshal(pioneerToPost)
	if e != nil {
		t.Error("Could not marshal pioneer struct")
		return e
	}
	req, err := http.NewRequest(http.MethodPost, "/api/pioneer", bytes.NewReader(rawPioneer))
	if err != nil {
		t.Error("Could not construct pioneer POST request")
		return err
	}
	postResponseRecorder := httptest.NewRecorder()
	internal.ServeMux.ServeHTTP(postResponseRecorder, req)
	if postResponseRecorder.Code != 200 {
		t.Error("Post was not successful", postResponseRecorder.Body.String())
		return nil
	}
	return err
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
	choreId := uuid.New()
	chore := map[string]string{
		"name":        "Compiled Cans",
		"id":          choreId.String(),
		"description": "Bruce knows how to can can",
		"title":       "Canner",
	}

	choreJSON, _ := json.Marshal(chore)
	request, _ := http.NewRequest(http.MethodPost, "/api/chore", bytes.NewReader(choreJSON))

	internal.ServeMux.ServeHTTP(httptest.NewRecorder(), request)

	getRequest, _ := http.NewRequest(http.MethodGet, "/api/chore", nil)

	getRecorder := httptest.NewRecorder()
	internal.ServeMux.ServeHTTP(getRecorder, getRequest)

	var responseJson []map[string]string
	if err := json.Unmarshal(getRecorder.Body.Bytes(), &responseJson); err != nil {
		t.Error("Could not parse server results.")
	}

	if !contains(responseJson, chore) {
		t.Errorf("List %v, did not contain %v", responseJson, chore)
	}
}

func contains(s []map[string]string, e map[string]string) bool {
	for _, a := range s {
		if cmp.Equal(a, e) {
			return true
		}
	}
	return false
}
