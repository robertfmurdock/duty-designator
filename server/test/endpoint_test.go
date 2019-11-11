package test

import (
	"fmt"
	"github.com/google/go-cmp/cmp"
	"github.com/google/uuid"
	"net/http"
	"reflect"
	"strings"
	"testing"
	"time"
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

	assertJsonObjectEqual(corral, *resultCorral, t)
}

func TestPutCorralMultipleTimes_GetWillReturnTheLatest(t *testing.T) {
	date := "11-11-11"
	corral := map[string]interface{}{
		"date":     date,
		"pioneers": []interface{}{},
		"chores":   []interface{}{},
	}
	if err := performPutCorral(corral); err != nil {
		t.Errorf("Post Corral Request failed. %v", err)
		return
	}

	ensureMeaningfulTimeHasPassed()

	updatedCorral := map[string]interface{}{
		"date":     date,
		"pioneers": []interface{}{map[string]interface{}{"name": "Rose", "id": uuid.New().String()}},
		"chores":   []interface{}{},
	}
	if err := performPutCorral(updatedCorral); err != nil {
		t.Errorf("Put Corral Request failed. %v", err)
		return
	}

	resultCorral, err := performGetCorralRequest(date)
	if err != nil {
		t.Errorf("Get Corral Request failed. %v", err)
		return
	}

	assertJsonObjectEqual(updatedCorral, *resultCorral, t)
}

func TestDeleteCorralWillRenderSubsequentGetsWith404(t *testing.T) {
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
		t.Errorf("Put Corral Request failed. %v", err)
		return
	}
	ensureMeaningfulTimeHasPassed()

	if err := performDeleteCorral(fmt.Sprintf("%v", corral["date"])); err != nil {
		t.Errorf("Delete Corral Request failed. %v", err)
		return
	}
	responseRecorder, err := performRequest(http.MethodGet, fmt.Sprintf("/api/corral/%s", date), nil)
	if err != nil {
		t.Errorf("Get request failed. %v", err)
	}
	if err := verifyNotFound(responseRecorder); err != nil {
		t.Errorf("%v", err)
	}
}

func ensureMeaningfulTimeHasPassed() {
	time.Sleep(1 * time.Millisecond)
}

func assertJsonObjectEqual(expected map[string]interface{}, actual map[string]interface{}, t *testing.T) {
	if !cmp.Equal(expected, actual) {
		t.Errorf("Returned expected was not equal:\n%v", cmp.Diff(expected, actual))
	}
}

func TestGetPioneerById(t *testing.T) {
	pioneerToPOST := map[string]string{"name": "Dewy Dooter", "id": uuid.New().String()}

	if err := performPostPioneer(pioneerToPOST); err != nil {
		t.Errorf("Post Pioneer Request failed. %v", err)
		return
	}

	pioneerRecords, err := performGetPioneerById(pioneerToPOST["id"])
	if err != nil {
		t.Errorf("Get Pioneer Request failed. %v", err)
		return
	}

	if !reflect.DeepEqual(pioneerRecords, pioneerToPOST) {
		t.Errorf("Slice %v\n did not contain: %v", pioneerRecords, pioneerToPOST)
	}
}

func TestRemovePioneerById(t *testing.T) {
	pioneerToPOST := map[string]string{"name": "Dewy Dooter", "id": uuid.New().String()}

	if err := performPostPioneer(pioneerToPOST); err != nil {
		t.Errorf("Post Pioneer Request failed. %v", err)
		return
	}

	statusCode, err := performDeletePioneerById(pioneerToPOST["id"])
	if err != nil {
		t.Errorf("Get Pioneer Request failed. %v", err)
		return
	}

	if statusCode != http.StatusOK {
		t.Errorf("Resposne code %v\n was not%v", statusCode, http.StatusOK)
	}
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

func TestRemoveChoreById(t *testing.T) {
	choreToPOST := map[string]string{"name": "Dewy Dooter", "id": uuid.New().String()}

	if err := performPostChore(choreToPOST); err != nil {
		t.Errorf("Post Chore Request failed. %v", err)
		return
	}

	statusCode, err := performDeleteChoreById(choreToPOST["id"])
	if err != nil {
		t.Errorf("Get Chore Request failed. %v", err)
		return
	}

	if statusCode != http.StatusOK {
		t.Errorf("Resposne code %v\n was not%v", statusCode, http.StatusOK)
	}
}

func Test_CanPutAndGetDutyRosters(t *testing.T) {
	pioneer := map[string]interface{}{"name": "Fuel-synergy", "id": uuid.New().String()}
	chore := map[string]interface{}{
		"name":        "Rustle the cattle",
		"id":          uuid.New().String(),
		"description": "Steal all them cattle",
		"title":       "Rustler",
	}

	duties := []interface{}{
		map[string]interface{}{"pioneer": pioneer, "chore": chore, "completed": true},
	}

	date := "11-11-11"

	roster := map[string]interface{}{
		"date":   date,
		"duties": duties,
	}

	if err := performPutRoster(roster); err != nil {
		t.Errorf("Cannot put roster. %v", err)
		return
	}

	loadedRoster, err := performGetRoster(date)
	if err != nil {
		t.Errorf("Cannot get roster %v", err)
	}

	assertJsonObjectEqual(loadedRoster, roster, t)
}

func TestDeleteRosterWillRenderSubsequentGetsWith404(t *testing.T) {
	pioneer := map[string]interface{}{"name": "Fuel-synergy", "id": uuid.New().String()}
	chore := map[string]interface{}{
		"name":        "Rustle the cattle",
		"id":          uuid.New().String(),
		"description": "Steal all them cattle",
		"title":       "Rustler",
	}

	duties := []interface{}{
		map[string]interface{}{"pioneer": pioneer, "chore": chore, "completed": true},
	}

	date := "11-11-11"

	roster := map[string]interface{}{
		"date":   date,
		"duties": duties,
	}

	if err := performPutRoster(roster); err != nil {
		t.Errorf("Cannot put roster. %v", err)
		return
	}
	ensureMeaningfulTimeHasPassed()

	if err := performDeleteRoster(fmt.Sprintf("%v", roster["date"])); err != nil {
		t.Errorf("Delete Roster Request failed. %v", err)
		return
	}
	responseRecorder, err := performRequest(http.MethodGet, fmt.Sprintf("/api/roster/%s", date), nil)
	if err != nil {
		t.Errorf("Get request failed. %v", err)
	}
	if err := verifyNotFound(responseRecorder); err != nil {
		t.Errorf("%v", err)
	}
}
