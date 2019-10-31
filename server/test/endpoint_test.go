package test

import (
	"duty-designator/server/internal"
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
	internal.ClientPath = "../../client/build"
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
	internal.ClientPath = "../../client/build"
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
