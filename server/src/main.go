package src

import (
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
)

var ServeMux = initializeMux()

type CandidateRecord struct {
	Name string `json:"name"`
	Id   string `json:"id"`
}

func initializeMux() http.Handler {
	client, err := GetDBClient()
	if err != nil {
		log.Fatal(err)
		return nil
	}

	mux := http.NewServeMux()
	mux.Handle("/api/candidate", candidateHandler(client))
	return mux
}

func candidateHandler(dbClient *mongo.Client) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		switch request.Method {
		case http.MethodGet:
			getTaskAssignmentsHandler(writer, request, dbClient)
		case http.MethodPost:
			postTaskAssignmentsHandler(writer, request, dbClient)
		}
	})
}

func GetDBClient() (*mongo.Client, error) {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	return client, nil
}

func getTaskAssignmentsHandler(writer http.ResponseWriter, request *http.Request, dbClient *mongo.Client) {
	writer.Header().Set("Content-Type", "application/json")

	collection := dbClient.Database("dutyDB").Collection("assignments")
	cursor, err := collection.Find(context.TODO(), bson.D{})

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		log.Fatal(err)
	}

	var rows []CandidateRecord
	err = cursor.All(context.TODO(), &rows)

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		log.Fatal(err)
	}

	candidateJson, err := json.Marshal(rows)

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		log.Fatal(err)
	}

	writer.Header().Set("Content-Type", "application/json")
	_, _ = writer.Write(candidateJson)
}

func postTaskAssignmentsHandler(writer http.ResponseWriter, request *http.Request, dbClient *mongo.Client) {
	decoder := json.NewDecoder(request.Body)
	var candidateRecord CandidateRecord
	err := decoder.Decode(&candidateRecord)
	if err != nil {
		http.Error(writer, "Bad request", http.StatusInternalServerError)
	}

	collection := dbClient.Database("dutyDB").Collection("assignments")

	if _, err := collection.InsertOne(context.Background(), candidateRecord); err != nil {
		http.Error(writer, fmt.Sprintf("Insert error %v", err), http.StatusInternalServerError)
		return
	}
}
