package test

import (
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
	database := client.Database("dutyDB")
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

func contains(s []src.Row, e src.Row) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
