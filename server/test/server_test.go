package test

import (
	"bytes"
	"context"
	"duty-designator/server/internal"
	"encoding/json"
	"github.com/google/go-cmp/cmp"
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

func TestGetPioneers_RespondsWithPioneerJson(t *testing.T) {
	expectedPioneer, err := insertNewPioneer(t)
	if err != nil {
		t.Errorf("Setup failed. %v", err)
		return
	}

	pioneerRecords, err := performGetPioneerRequest(t)
	if err != nil {
		t.Errorf("Get Pioneer Request failed. %v", err)
		return
	}

	if !contains(pioneerRecords, expectedPioneer) {
		t.Errorf("%v, %v", pioneerRecords, expectedPioneer)
	}
}

func TestGetPioneers_WhenDatabaseDoesNotExistWillReturnEmptyList(t *testing.T) {
	if err := getDutyDB().Drop(context.Background()); err != nil {
		t.Errorf("Setup failed. %v", err)
		return
	}

	pioneerRecords, err := performGetPioneerRequest(t)
	if err != nil {
		t.Errorf("Get Pioneer Request failed. %v", err)
		return
	}

	if pioneerRecords == nil || len(pioneerRecords) != 0 {
		t.Error("There was unexpected pioneer content")
	}
}

func performGetPioneerRequest(t *testing.T) ([]internal.PioneerRecord, error) {
	responseRecorder := httptest.NewRecorder()
	request, err := http.NewRequest(http.MethodGet, "/api/pioneer", nil)
	if err != nil {
		t.Error("Could not build get request.")
		return nil, err
	}
	internal.ServeMux.ServeHTTP(responseRecorder, request)

	var actualResponseBody []internal.PioneerRecord
	if err := json.Unmarshal(responseRecorder.Body.Bytes(), &actualResponseBody); err != nil {
		t.Error("Could not parse server results.")
	}

	return actualResponseBody, nil
}

func insertNewPioneer(t *testing.T) (internal.PioneerRecord, error) {
	database := getDutyDB()
	assignmentCollection := database.Collection("pioneers")
	bobsId := uuid.New()
	_, err := assignmentCollection.InsertOne(
		context.Background(), bson.M{"Name": "bob", "id": bobsId.String()})
	if err != nil {
		t.Error("Could not insert")
		return internal.PioneerRecord{}, err
	}

	return internal.PioneerRecord{Name: "bob", Id: bobsId.String()}, nil
}

func getDutyDB() *mongo.Database {
	database := client.Database("dutyDB")
	return database
}

func TestPostPioneerHandler_AfterPostCanGetInformationFromGet(t *testing.T) {
	pioneerToPOST := internal.PioneerRecord{Name: "Alice", Id: uuid.New().String()}

	if err := performPostPioneer(pioneerToPOST, t); err != nil {
		t.Errorf("Post Pioneer Request failed. %v", err)
		return
	}

	pioneerRecords, err := performGetPioneerRequest(t)
	if err != nil {
		t.Errorf("Get Pioneer Request failed. %v", err)
		return
	}

	if !contains(pioneerRecords, pioneerToPOST) {
		t.Errorf("Slice %v\n did not contain: %v", pioneerRecords, pioneerToPOST)
	}
}

func performPostPioneer(pioneerToPost internal.PioneerRecord, t *testing.T) error {
	rawPioneer, e := json.Marshal(pioneerToPost)
	if e != nil {
		t.Error("Could not marshal pioneer struct")
		return e
	}
	req, err := http.NewRequest(http.MethodPost, "/api/pioneer", bytes.NewReader(rawPioneer))
	if err != nil {
		t.Error("Could not construct pioneer POST request")
		return err
	}
	postResponseRecorder := httptest.NewRecorder()
	internal.ServeMux.ServeHTTP(postResponseRecorder, req)
	if postResponseRecorder.Code != 200 {
		t.Error("Post was not successful", postResponseRecorder.Body.String())
		return nil
	}
	return err
}

func contains(s []internal.PioneerRecord, e internal.PioneerRecord) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func containsChore(s []map[string]string, e map[string]string) bool {
	for _, a := range s {
		if cmp.Equal(a, e) {
			return true
		}
	}
	return false
}

func TestPostChore_WillWorkWithGetChore(t *testing.T) {
	choreId := uuid.New()
	chore := map[string]string{
		"name":        "Compiled Cans",
		"id":          choreId.String(),
		"description": "Bruce knows how to can can",
		"title":       "Canner",
	}

	choreJSON, _ := json.Marshal(chore)
	request, _ := http.NewRequest(http.MethodPost, "/api/chore", bytes.NewReader(choreJSON))

	internal.ServeMux.ServeHTTP(httptest.NewRecorder(), request)

	getRequest, _ := http.NewRequest(http.MethodGet, "/api/chore", nil)

	getRecorder := httptest.NewRecorder()
	internal.ServeMux.ServeHTTP(getRecorder, getRequest)

	var responseJson []map[string]string
	if err := json.Unmarshal(getRecorder.Body.Bytes(), &responseJson); err != nil {
		t.Error("Could not parse server results.")
	}

	if !containsChore(responseJson, chore) {
		t.Errorf("List %v, did not contain %v", responseJson, chore)
	}
}

func TestGetChore_WhenDatabaseDoesNotExistWillReturnEmptyList(t *testing.T) {
	responseRecorder := httptest.NewRecorder()
	request, _ := http.NewRequest(http.MethodGet, "/api/chore", nil)

	if err := client.Database("dutyDB").Drop(context.Background()); err != nil {
		t.Error("Drop was not successful", err)
	}

	internal.ServeMux.ServeHTTP(responseRecorder, request)

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
