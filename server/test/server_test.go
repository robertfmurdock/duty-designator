package test

import (
	"bytes"
	"context"
	"duty-designator/server/src"
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

var client = initConnection()

func initConnection() *mongo.Client {
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))

	if err != nil {
		log.Fatal("Could not connect to Mongo")
		return nil
	}
	return client
}

func TestGetCandidatesHandler_RespondsWithCandidateJson(t *testing.T) {
	database := getDutyDB()
	assignmentCollection := database.Collection("assignments")
	bobsId := uuid.New()

	_, err := assignmentCollection.InsertOne(
		context.Background(), bson.M{"Candidate": "bob", "Task": "dishes", "id": bobsId.String()})

	if err != nil {
		t.Error("Could not insert")
		return
	}

	responseRecorder := httptest.NewRecorder()
	handler := http.HandlerFunc(src.GetTaskAssignmentsHandler)
	handler.ServeHTTP(responseRecorder, nil)

	expectedCandidate := src.Row{Candidate: "bob", Task: "dishes", Id: bobsId.String()}

	var actualResponse []src.Row
	if err := json.Unmarshal(responseRecorder.Body.Bytes(), &actualResponse); err != nil {
		t.Error("Could not parse server results.")
	}

	if !contains(actualResponse, expectedCandidate) {
		t.Errorf("%v, %v", actualResponse, expectedCandidate)
	}
}

func getDutyDB() *mongo.Database {
	database := client.Database("dutyDB")
	return database
}

func TestPostCandidateHandler_AfterPostCanGetInformationFromGet(t *testing.T){
	candidateToPOST := src.Row{Candidate:"Alice", Task:"Clean", Id: uuid.New().String()}

	rawCandidate, e := json.Marshal(candidateToPOST)
	if e != nil {
		t.Error("Could not marshal candidate struct")
		return
	}

	req, err := http.NewRequest("POST", "/", bytes.NewReader(rawCandidate))
	if err != nil {
		t.Error("Could not construct candidate POST request")
		return
	}

	postResponseRecorder := httptest.NewRecorder()
	postHandler := http.HandlerFunc(src.PostTaskAssignmentsHandler)
	postHandler.ServeHTTP(postResponseRecorder, req)

	if postResponseRecorder.Code != 200 {
		t.Error("Post was not successful")
		return
	}
	getResponseRecorder := httptest.NewRecorder()
	handler := http.HandlerFunc(src.GetTaskAssignmentsHandler)
	handler.ServeHTTP(getResponseRecorder, nil)

	var actualResponse []src.Row
	if err := json.Unmarshal(getResponseRecorder.Body.Bytes(), &actualResponse); err != nil {
		t.Error("Could not parse server results.")
	}

	if !contains(actualResponse, candidateToPOST) {
		t.Errorf("Slice %v\n did not contain: %v", actualResponse, candidateToPOST)
	}

}

func contains(s []src.Row, e src.Row) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
