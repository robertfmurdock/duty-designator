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
		context.Background(), bson.M{"Name": "bob", "id": bobsId.String()})

	if err != nil {
		t.Error("Could not insert")
		return
	}

	responseRecorder := httptest.NewRecorder()
	request, err := http.NewRequest(http.MethodGet, "/api/candidate", nil)
	if err != nil {
		t.Error("Could not build get request.")
	}

	src.ServeMux.ServeHTTP(responseRecorder, request)

	expectedCandidate := src.CandidateRecord{Name: "bob", Id: bobsId.String()}

	var actualResponse []src.CandidateRecord
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

func TestPostCandidateHandler_AfterPostCanGetInformationFromGet(t *testing.T) {
	candidateToPOST := src.CandidateRecord{Name: "Alice", Id: uuid.New().String()}

	rawCandidate, e := json.Marshal(candidateToPOST)
	if e != nil {
		t.Error("Could not marshal candidate struct")
		return
	}

	req, err := http.NewRequest("POST", "/api/candidate", bytes.NewReader(rawCandidate))
	if err != nil {
		t.Error("Could not construct candidate POST request")
		return
	}

	postResponseRecorder := httptest.NewRecorder()

	src.ServeMux.ServeHTTP(postResponseRecorder, req)

	if postResponseRecorder.Code != 200 {
		t.Error("Post was not successful")
		return
	}
	getResponseRecorder := httptest.NewRecorder()

	getRequest, err := http.NewRequest(http.MethodGet, "/api/candidate", nil)
	if err != nil {
		t.Error("Could not build get request.")
	}

	src.ServeMux.ServeHTTP(getResponseRecorder, getRequest)

	var actualResponse []src.CandidateRecord
	if err := json.Unmarshal(getResponseRecorder.Body.Bytes(), &actualResponse); err != nil {
		t.Error("Could not parse server results.")
	}

	if !contains(actualResponse, candidateToPOST) {
		t.Errorf("Slice %v\n did not contain: %v", actualResponse, candidateToPOST)
	}

}

func contains(s []src.CandidateRecord, e src.CandidateRecord) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
