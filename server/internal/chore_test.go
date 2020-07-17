package internal

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
)

func TestPostChore_WillWriteToDb(t *testing.T) {
	chore := choreRecord{
		Name: "Compiled Cans",
		Id:   uuid.New().String(),
	}

	request, err := requestWithJsonBody(chore)
	if err != nil {
		t.Errorf("Could not produce request %v", err)
	}

	hC := handlerContext{dbClient: client}

	if err := postChoreHandler(httptest.NewRecorder(), request, &hC); err != nil {
		t.Errorf("post error: %s", err)
		return
	}

	choreRecords := loadChoresFromDb(t)

	if !containsChore(choreRecords, chore) {
		t.Errorf("List %v, did not contain %v", choreRecords, chore)
	}
}

func loadChoresFromDb(t *testing.T) []choreRecord {
	var choreRecords []choreRecord
	loadRecordsFromCollection(t, "chores", &choreRecords)
	return choreRecords
}

func requestWithJsonBody(bodyStruct interface{}) (*http.Request, error) {
	choreJSON, err := json.Marshal(bodyStruct)
	if err != nil {
		return nil, err
	}
	request, err := http.NewRequest(http.MethodPost, "/thisIsNotTestedHere", bytes.NewReader(choreJSON))
	return request, err
}

func TestGetChore_GetChoreReturnsChoreFromTheDb(t *testing.T) {
	chore := choreRecord{
		Id:          uuid.New().String(),
		Name:        "Compiled Cans",
		Description: "Those cruddy cans cant keep complaining",
		Title:       "Canner",
	}

	if err := insertChore(chore); err != nil {
		t.Error("insert was not successful", err)
	}

	hC := handlerContext{dbClient: client}
	responseRecorder := httptest.NewRecorder()

	if err := getChoresHandler(responseRecorder, &http.Request{}, &hC); err != nil {
		t.Errorf("post error: %s", err)
	}

	if responseRecorder.Code != 200 {
		t.Error("Post was not successful", responseRecorder.Body.String())
	}

	var choreList []choreRecord

	if err := json.Unmarshal(responseRecorder.Body.Bytes(), &choreList); err != nil {
		t.Error(err)
	}

	if !containsChore(choreList, chore) {
		t.Errorf("List %v, did not contain %v", choreList, chore)
	}
}

func insertChore(record choreRecord) error {
	collection := client.Database("dutyDB").Collection("chores")
	_, err := collection.InsertOne(context.Background(), record)
	return err
}

func containsChore(s []choreRecord, e choreRecord) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func TestGetChore_WhenDatabaseDoesNotExistWillReturnEmptyList(t *testing.T) {
	responseRecorder := httptest.NewRecorder()
	if err := client.Database("dutyDB").Drop(context.Background()); err != nil {
		t.Error("Drop was not successful", err)
	}

	hC := handlerContext{dbClient: client}
	if err := getChoresHandler(responseRecorder, &http.Request{}, &hC); err != nil {
		t.Errorf("get error: %s", err)
	}

	if responseRecorder.Code != 200 {
		t.Error("Post was not successful", responseRecorder.Body.String())
	}

	var choreList []map[string]interface{}
	var body = responseRecorder.Body.Bytes()
	if err := json.Unmarshal(body, &choreList); err != nil {
		t.Error(err)
	}

	if choreList == nil || len(choreList) != 0 {
		t.Error("There was unexpected chore content", responseRecorder.Body.String())
	}
}

func TestDeleteChoreById_RespondsWith200Ok(t *testing.T) {
	expectedChore := choreRecord{Name: "Wash them dishes", Id: uuid.New().String()}
	err := insertChore(expectedChore)

	if err != nil {
		t.Errorf("Setup failed. %v", err)
		return
	}

	responseRecorder := httptest.NewRecorder()
	choreUrl := url.URL{Path: fmt.Sprintf("/chore/%s", expectedChore.Id)}
	hC := handlerContext{dbClient: client}
	request := &http.Request{URL: &choreUrl}

	if err := removeChoreByIdHandler(responseRecorder, request, &hC); err != nil {
		t.Errorf("handler error: %s", err)
	}

	if choreRecords := loadChoresFromDb(t); containsChore(choreRecords, expectedChore) {
		t.Errorf("List %v, contained %v", choreRecords, expectedChore)
	}

	if status := responseRecorder.Code; status != http.StatusOK {
		t.Errorf("%v, %v", status, http.StatusOK)
	}
}
