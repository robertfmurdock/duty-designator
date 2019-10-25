package test

import (
	"bytes"
	"context"
	"duty-designator/server/routing"
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
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))

	if err != nil {
		log.Fatal("Could not connect to Mongo")
		return nil
	}
	defer cancel()
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

func TestGetCandidatesHandler_WhenDatabaseDoesNotExistWillReturnEmptyList(t *testing.T) {
	if err := getDutyDB().Drop(context.Background()); err != nil {
		t.Errorf("Setup failed. %v", err)
		return
	}

	candidateRecords, err := performGetCandidatesRequest(t)
	if err != nil {
		t.Errorf("Get Candidate Request failed. %v", err)
		return
	}

	if candidateRecords == nil || len(candidateRecords) != 0 {
		t.Error("There was unexpected chore content")
	}
}

func performGetCandidatesRequest(t *testing.T) ([]routing.CandidateRecord, error) {
	responseRecorder := httptest.NewRecorder()
	request, err := http.NewRequest(http.MethodGet, "/api/candidate", nil)
	if err != nil {
		t.Error("Could not build get request.")
		return nil, err
	}
	routing.ServeMux.ServeHTTP(responseRecorder, request)

	var actualResponseBody []routing.CandidateRecord
	if err := json.Unmarshal(responseRecorder.Body.Bytes(), &actualResponseBody); err != nil {
		t.Error("Could not parse server results.")
	}

	return actualResponseBody, nil
}

func insertNewCandidate(t *testing.T) (routing.CandidateRecord, error) {
	database := getDutyDB()
	assignmentCollection := database.Collection("candidates")
	bobsId := uuid.New()
	_, err := assignmentCollection.InsertOne(
		context.Background(), bson.M{"Name": "bob", "id": bobsId.String()})
	if err != nil {
		t.Error("Could not insert")
		return routing.CandidateRecord{}, err
	}

	return routing.CandidateRecord{Name: "bob", Id: bobsId.String()}, nil
}

func getDutyDB() *mongo.Database {
	database := client.Database("dutyDB")
	return database
}

func TestPostCandidateHandler_AfterPostCanGetInformationFromGet(t *testing.T) {
	candidateToPOST := routing.CandidateRecord{Name: "Alice", Id: uuid.New().String()}

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

func performPostCandidate(candidateToPOST routing.CandidateRecord, t *testing.T) error {
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
	routing.ServeMux.ServeHTTP(postResponseRecorder, req)
	if postResponseRecorder.Code != 200 {
		t.Error("Post was not successful", postResponseRecorder.Body.String())
		return nil
	}
	return err
}

func contains(s []routing.CandidateRecord, e routing.CandidateRecord) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func TestPostChore_WillWriteToDb(t *testing.T) {
	responseRecorder := httptest.NewRecorder()

	choreId := uuid.New()
	chore := routing.ChoreRecord{
		Name: "Compiled Cans",
		Id:   choreId.String(),
	}

	choreJSON, _ := json.Marshal(chore)
	request, _ := http.NewRequest(http.MethodPost, "/api/chore", bytes.NewReader(choreJSON))

	routing.ServeMux.ServeHTTP(responseRecorder, request)

	collection := client.Database("dutyDB").Collection("chores")

	cursor, err := collection.Find(context.TODO(), bson.D{})

	if err != nil {
		t.Errorf("MongoDB find error: %s", err)
	}

	var rows []routing.ChoreRecord
	err = cursor.All(context.TODO(), &rows)

	if !containsChoreID(rows, choreId.String()) {
		t.Log(rows)
		t.Errorf("MongoDB did not return chore from InsertChore")
	}
}

func TestGetChore_GetChoreReturnsAChoreThatWasPosted(t *testing.T) {
	responseRecorder := httptest.NewRecorder()
	request, _ := http.NewRequest(http.MethodGet, "/api/chore", nil)

	choreId := uuid.New()
	chore := routing.ChoreRecord{
		Name:        "Compiled Cans",
		Description: "Those cruddy cans cant keep complaining",
		Id:          choreId.String(),
	}

	if err := insertChore(chore); err != nil {
		t.Error("insert was not successful", err)
	}

	routing.ServeMux.ServeHTTP(responseRecorder, request)

	if responseRecorder.Code != 200 {
		t.Error("Post was not successful", responseRecorder.Body.String())
	}

	var choreList []routing.ChoreRecord
	var body = responseRecorder.Body.Bytes()
	if err := json.Unmarshal(body, &choreList); err != nil {
		t.Error(err)
	}

	if !containsChoreID(choreList, choreId.String()) {
		t.Log(choreList)
		t.Errorf("GetChore did not return chore from InsertChore")
	}

	if !containsChoreDescription(choreList, chore.Description) {
		t.Log(choreList)
		t.Errorf("GetChore did not find chore description from InsertChore")
	}
}

func TestGetChore_WhenDatabaseDoesNotExistWillReturnEmptyList(t *testing.T) {
	responseRecorder := httptest.NewRecorder()
	request, _ := http.NewRequest(http.MethodGet, "/api/chore", nil)

	if err := client.Database("dutyDB").Drop(context.Background()); err != nil {
		t.Error("Drop was not successful", err)
	}

	routing.ServeMux.ServeHTTP(responseRecorder, request)

	if responseRecorder.Code != 200 {
		t.Error("Post was not successful", responseRecorder.Body.String())
	}

	var choreList []routing.ChoreRecord
	var body = responseRecorder.Body.Bytes()
	if err := json.Unmarshal(body, &choreList); err != nil {
		t.Error(err)
	}

	if choreList == nil || len(choreList) != 0 {
		t.Error("There was unexpected chore content", responseRecorder.Body.String())
	}
}

func insertChore(record routing.ChoreRecord) error {
	collection := client.Database("dutyDB").Collection("chores")
	_, err := collection.InsertOne(context.Background(), record)
	return err
}

func containsChoreID(s []routing.ChoreRecord, id string) bool {
	for _, a := range s {
		if a.Id == id {
			return true
		}
	}
	return false
}

func containsChoreDescription(s []routing.ChoreRecord, desc string) bool {
	for _, a := range s {
		if a.Description == desc {
			return true
		}
	}
	return false
}
