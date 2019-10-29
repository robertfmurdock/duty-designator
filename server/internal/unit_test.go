package internal

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestGetDBClient_ReturnsClient(t *testing.T) {
	client, _ := getDBClient()

	if client == nil {
		t.Fail()
	}
}

var client = initConnection()

func initConnection() *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))

	if err != nil {
		log.Fatal("Could not connect to Mongo")
		return nil
	}
	defer cancel()
	return client
}

func TestPostChore_WillWriteToDb(t *testing.T) {
	responseRecorder := httptest.NewRecorder()

	choreId := uuid.New()
	chore := choreRecord{
		Name: "Compiled Cans",
		Id:   choreId.String(),
	}

	choreJSON, _ := json.Marshal(chore)
	request, _ := http.NewRequest(http.MethodPost, "/api/chore", bytes.NewReader(choreJSON))

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
	request, _ := http.NewRequest(http.MethodGet, "/api/chore", nil)

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

	if err := getChoresHandler(responseRecorder, request, &hC); err != nil {
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
