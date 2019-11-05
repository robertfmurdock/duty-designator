package test

import (
	"encoding/json"
	"fmt"
	"github.com/google/go-cmp/cmp"
	"github.com/google/uuid"
	"net/http"
	"strings"
	"testing"
)

func TestPostPioneerHandler_AfterPostCanGetInformationFromGet(t *testing.T) {
	pioneerToPOST := map[string]string{"name": "Alice", "id": uuid.New().String()}

	if err := performPostPioneer(pioneerToPOST); err != nil {
		t.Errorf("Post Pioneer Request failed. %v", err)
		return
	}

	pioneerRecords, err := performGetPioneerRequest()
	if err != nil {
		t.Errorf("Get Pioneer Request failed. %v", err)
		return
	}

	if !jsonArrayContains(pioneerRecords, pioneerToPOST) {
		t.Errorf("Slice %v\n did not contain: %v", pioneerRecords, pioneerToPOST)
	}
}

func TestPutCorral_AfterPutCanGetCorral(t *testing.T) {
	pioneer := map[string]interface{}{"name": "Alice", "id": uuid.New().String()}
	chore := map[string]interface{}{
		"name":        "Compiled Cans",
		"id":          uuid.New().String(),
		"description": "Bruce knows how to can can",
		"title":       "Canner",
	}
	date := "11-11-11"

	corral := map[string]interface{}{
		"date":     date,
		"pioneers": []interface{}{pioneer},
		"chores":   []interface{}{chore},
	}

	if err := performPutCorral(corral); err != nil {
		t.Errorf("Post Corral Request failed. %v", err)
		return
	}

	resultCorral, err := performGetCorralRequest(date)
	if err != nil {
		t.Errorf("Get Corral Request failed. %v", err)
		return
	}

	if !cmp.Equal(corral, *resultCorral) {
		t.Errorf("Returned corral was not equal:\n%v", cmp.Diff(corral, *resultCorral))
	}
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

func performPutCorral(corralToPut map[string]interface{}) error {
	responseRecorder, err := performRequest(http.MethodPut, fmt.Sprintf("/api/corral/%s", corralToPut["date"]), corralToPut)
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
	return parseBodyAsJson(responseRecorder)
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
	responseJson, err := performGetChores()
	if err != nil {
		t.Errorf("Get Chore Request failed. %v", err)
		return
	}
	if !jsonArrayContains(responseJson, chore) {
		t.Errorf("List %v, did not contain %v", responseJson, chore)
	}
}

func TestIndexHtmlIsReturnedFromRandomPaths(t *testing.T) {
	responseRecorder, err := performRequest(http.MethodGet, "/random/thing/not/a/real/path", nil)
	if err != nil {
		t.Errorf("Got an error on http request. %v", err)
		return
	}

	if err := verifySuccessfulRequest(responseRecorder); err != nil {
		t.Errorf("Result was not successful. %v", err)
	}

	bodyString := responseRecorder.Body.String()

	if !strings.Contains(bodyString, "<title>Chore Wheel</title>") {
		t.Errorf("Result was not the index page. %v", err)
	}
}

func TestRealPathsStillReturnContent(t *testing.T) {
	responseRecorder, err := performRequest(http.MethodGet, "/build/index.css", nil)
	if err != nil {
		t.Errorf("Got an error on http request. %v", err)
		return
	}

	if err := verifySuccessfulRequest(responseRecorder); err != nil {
		t.Errorf("Result was not successful. %v", err)
	}

	bodyString := responseRecorder.Body.String()

	if strings.Contains(bodyString, "<title>Chore Wheel</title>") {
		t.Errorf("Result was the index page... and it shouldn 't be! %v", err)
	}
}

func performGetChores() ([]map[string]string, error) {
	responseRecorder, err := performRequest(http.MethodGet, "/api/chore", nil)
	if err != nil {
		return nil, err
	}
	if err := verifySuccessfulRequest(responseRecorder); err != nil {
		return nil, err
	}
	return parseBodyAsJson(responseRecorder)
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
