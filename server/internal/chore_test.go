package internal

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestPostChore_WillWriteToDb(t *testing.T) {
	responseRecorder := httptest.NewRecorder()

	choreId := uuid.New()
	chore := choreRecord{
		Name: "Compiled Cans",
		Id:   choreId.String(),
	}

	choreJSON, _ := json.Marshal(chore)
	request, _ := http.NewRequest(http.MethodPost, "/thisIsNotTestedHere", bytes.NewReader(choreJSON))

	hC := handlerContext{dbClient: client}

	if err := postChoreHandler(responseRecorder, request, &hC); err != nil {
		t.Errorf("post error: %s", err)
	}

	collection := client.Database("dutyDB").Collection("chores")

	cursor, err := collection.Find(context.TODO(), bson.D{})

	if err != nil {
		t.Errorf("MongoDB find error: %s", err)
	}

	var choreRecords []choreRecord
	err = cursor.All(context.TODO(), &choreRecords)

	if err != nil {
		t.Errorf("MongoDB load error: %s", err)
	}

	if !containsChore(choreRecords, chore) {
		t.Errorf("List %v, did not contain %v", choreRecords, chore)
	}
}

func TestGetChore_GetChoreReturnsChoreFromTheDb(t *testing.T) {
	responseRecorder := httptest.NewRecorder()

	choreId := uuid.New()
	chore := choreRecord{
		Id:          choreId.String(),
		Name:        "Compiled Cans",
		Description: "Those cruddy cans cant keep complaining",
		Title:       "Canner",
	}

	if err := insertChore(chore); err != nil {
		t.Error("insert was not successful", err)
	}

	hC := handlerContext{dbClient: client}
	if err := getChoresHandler(responseRecorder, &http.Request{}, &hC); err != nil {
		t.Errorf("post error: %s", err)
	}

	if responseRecorder.Code != 200 {
		t.Error("Post was not successful", responseRecorder.Body.String())
	}

	var choreList []choreRecord
	var body = responseRecorder.Body.Bytes()
	if err := json.Unmarshal(body, &choreList); err != nil {
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
