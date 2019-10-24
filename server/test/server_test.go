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

func TestPostChore_WillWriteToDb(t *testing.T) {
	responseRecorder := httptest.NewRecorder()

	choreId := uuid.New()
	chore := src.ChoreRecord{
		Name: "Compiled Cans",
		Id:   choreId.String(),
	}

	choreJSON, _ := json.Marshal(chore)
	request, _ := http.NewRequest(http.MethodPost, "/api/chore", bytes.NewReader(choreJSON))

	src.ServeMux.ServeHTTP(responseRecorder, request)

	client, err := src.GetDBClient()

	if err != nil {
		t.Errorf("Could not get mongo client: %s", err)
	}

	collection := client.Database("dutyDB").Collection("chores")

	cursor, err := collection.Find(context.TODO(), bson.D{})

	if err != nil {
		t.Errorf("MongoDB find error: %s", err)
	}

	var rows []src.ChoreRecord
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
	chore := src.ChoreRecord{
		Name: "Compiled Cans",
		Id:   choreId.String(),
	}

	insertChore(chore)

	src.ServeMux.ServeHTTP(responseRecorder, request)

	if responseRecorder.Code != 200 {
		t.Error("Post was not successful", responseRecorder.Body.String())
	}

	var choreList []src.ChoreRecord
	var body = responseRecorder.Body.Bytes()
	if err := json.Unmarshal(body, &choreList); err != nil {
		t.Error(err)
	}

	if !containsChoreID(choreList, choreId.String()) {
		t.Log(choreList)
		t.Errorf("GetChore did not return chore from InsertChore")
	}
}

func TestGetChore_WhenDatabaseDoesNotExistWillReturnEmptyList(t *testing.T) {
	responseRecorder := httptest.NewRecorder()
	request, _ := http.NewRequest(http.MethodGet, "/api/chore", nil)

	dbClient, _ := src.GetDBClient()

	dbClient.Database("dutyDB").Drop(context.Background())

	src.ServeMux.ServeHTTP(responseRecorder, request)

	if responseRecorder.Code != 200 {
		t.Error("Post was not successful", responseRecorder.Body.String())
	}

	var choreList []src.ChoreRecord
	var body = responseRecorder.Body.Bytes()
	if err := json.Unmarshal(body, &choreList); err != nil {
		t.Error(err)
	}

	if choreList == nil || len(choreList) != 0 {
		t.Error("There was unexpected chore content", responseRecorder.Body.String())
	}
}

func insertChore(record src.ChoreRecord) {
	dbClient, _ := src.GetDBClient()

	collection := dbClient.Database("dutyDB").Collection("chores")
	collection.InsertOne(context.Background(), record)
}

func containsChoreID(s []src.ChoreRecord, id string) bool {
	for _, a := range s {
		if a.Id == id {
			return true
		}
	}
	return false
}
