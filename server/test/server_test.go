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
	expectedCandidate, err := insertNewCandidate(t)
	if err != nil {
		t.Errorf("Setup failed. %v", err)
		return
	}

	candidateRecords, err := performGetCandidatesRequest(t)
	if err != nil {
		t.Errorf("Get Candidate Request failed. %v", err)
		return
	}

	if !contains(candidateRecords, expectedCandidate) {
		t.Errorf("%v, %v", candidateRecords, expectedCandidate)
	}
}

func performGetCandidatesRequest(t *testing.T) ([]src.CandidateRecord, error) {
	responseRecorder := httptest.NewRecorder()
	request, err := http.NewRequest(http.MethodGet, "/api/candidate", nil)
	if err != nil {
		t.Error("Could not build get request.")
		return nil, err
	}
	src.ServeMux.ServeHTTP(responseRecorder, request)

	var actualResponseBody []src.CandidateRecord
	if err := json.Unmarshal(responseRecorder.Body.Bytes(), &actualResponseBody); err != nil {
		t.Error("Could not parse server results.")
	}

	return actualResponseBody, nil
}

func insertNewCandidate(t *testing.T) (src.CandidateRecord, error) {
	database := getDutyDB()
	assignmentCollection := database.Collection("candidates")
	bobsId := uuid.New()
	_, err := assignmentCollection.InsertOne(
		context.Background(), bson.M{"Name": "bob", "id": bobsId.String()})
	if err != nil {
		t.Error("Could not insert")
		return src.CandidateRecord{}, err
	}

	return src.CandidateRecord{Name: "bob", Id: bobsId.String()}, nil
}

func getDutyDB() *mongo.Database {
	database := client.Database("dutyDB")
	return database
}

func TestPostCandidateHandler_AfterPostCanGetInformationFromGet(t *testing.T) {
	candidateToPOST := src.CandidateRecord{Name: "Alice", Id: uuid.New().String()}

	if err := performPostCandidate(candidateToPOST, t); err != nil {
		t.Errorf("Post Candidate Request failed. %v", err)
		return
	}

	candidateRecords, err := performGetCandidatesRequest(t)
	if err != nil {
		t.Errorf("Get Candidate Request failed. %v", err)
		return
	}

	if !contains(candidateRecords, candidateToPOST) {
		t.Errorf("Slice %v\n did not contain: %v", candidateRecords, candidateToPOST)
	}
}

func performPostCandidate(candidateToPOST src.CandidateRecord, t *testing.T) error {
	rawCandidate, e := json.Marshal(candidateToPOST)
	if e != nil {
		t.Error("Could not marshal candidate struct")
		return e
	}
	req, err := http.NewRequest(http.MethodPost, "/api/candidate", bytes.NewReader(rawCandidate))
	if err != nil {
		t.Error("Could not construct candidate POST request")
		return err
	}
	postResponseRecorder := httptest.NewRecorder()
	src.ServeMux.ServeHTTP(postResponseRecorder, req)
	if postResponseRecorder.Code != 200 {
		t.Error("Post was not successful", postResponseRecorder.Body.String())
		return nil
	}
	return err
}

func contains(s []src.CandidateRecord, e src.CandidateRecord) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
