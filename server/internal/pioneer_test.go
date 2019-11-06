package internal

import (
	"context"
	"encoding/json"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
	"net/http/httptest"
	"reflect"
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

	responseRecorder := httptest.NewRecorder()
	hC := handlerContext{dbClient: client}
	if err := getPioneerHandler(responseRecorder, &http.Request{}, &hC); err != nil {
		t.Errorf("handler error: %s", err)
	}

	var pioneerRecords []pioneerRecord
	if err := json.Unmarshal(responseRecorder.Body.Bytes(), &pioneerRecords); err != nil {
		t.Error("Could not parse server results.")
	}
	if !contains(pioneerRecords, expectedPioneer) {
		t.Errorf("%v, %v", pioneerRecords, expectedPioneer)
	}
}

func insertNewPioneer(t *testing.T) (pioneerRecord, error) {
	database := getDutyDB()
	assignmentCollection := database.Collection("pioneers")
	bobsId := uuid.New()
	_, err := assignmentCollection.InsertOne(
		context.Background(), bson.M{"Name": "bob", "id": bobsId.String()})
	if err != nil {
		t.Error("Could not insert")
		return pioneerRecord{}, err
	}

	return pioneerRecord{Name: "bob", Id: bobsId.String()}, nil
}

func getDutyDB() *mongo.Database {
	database := client.Database("dutyDB")
	return database
}

func contains(s []pioneerRecord, e pioneerRecord) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func TestGetPioneers_WhenDatabaseDoesNotExistWillReturnEmptyList(t *testing.T) {
	if err := getDutyDB().Drop(context.Background()); err != nil {
		t.Errorf("Setup failed. %v", err)
		return
	}

	responseRecorder := httptest.NewRecorder()
	hC := handlerContext{dbClient: client}
	if err := getPioneerHandler(responseRecorder, &http.Request{}, &hC); err != nil {
		t.Errorf("handler error: %s", err)
	}

	var pioneerRecords []pioneerRecord
	if err := json.Unmarshal(responseRecorder.Body.Bytes(), &pioneerRecords); err != nil {
		t.Error("Could not parse server results.")
	}

	if pioneerRecords == nil || len(pioneerRecords) != 0 {
		t.Error("There was unexpected pioneer content")
	}
}

func TestGetPioneersById_RespondsWithSinglePioneerJson(t *testing.T) {
	expectedPioneer, err := insertNewPioneer(t)
	if err != nil {
		t.Errorf("Setup failed. %v", err)
		return
	}

	responseRecorder := httptest.NewRecorder()
	hC := handlerContext{dbClient: client}
	if err := getPioneerByIdHandler(responseRecorder, &http.Request{}, &hC); err != nil {
		t.Errorf("handler error: %s", err)
	}

	var pioneerRecord pioneerRecord
	if err := json.Unmarshal(responseRecorder.Body.Bytes(), &pioneerRecord); err != nil {
		t.Error("Could not parse server results.")
	}
	if !reflect.DeepEqual(pioneerRecord, expectedPioneer) {
		t.Errorf("%v, %v", pioneerRecord, expectedPioneer)
	}
}
