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

var insertedChores []ChoreRecord

type CandidateRecord struct {
	Name string `json:"name"`
	Id   string `json:"id"`
}

type ChoreRecord struct {
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
	mux.Handle("/", http.FileServer(http.Dir("../client/build")))
	mux.Handle("/api/candidate", candidateHandler(client))
	mux.Handle("/api/chore", choreHandler(client))
	return mux
}

func candidateHandler(dbClient *mongo.Client) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		switch request.Method {
		case http.MethodGet:
			getCandidateHandler(writer, request, dbClient)
		case http.MethodPost:
			postCandidateHandler(writer, request, dbClient)
		}
	})
}

func choreHandler(dbClient *mongo.Client) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		switch request.Method {
		case http.MethodGet:
			GetChore(writer, request, dbClient)
		case http.MethodPost:
			InsertChoreFromHTTP(writer, request, dbClient)
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

func getCandidateHandler(writer http.ResponseWriter, request *http.Request, dbClient *mongo.Client) {
	writer.Header().Set("Content-Type", "application/json")

	collection := getCandidatesCollection(dbClient)
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

func postCandidateHandler(writer http.ResponseWriter, request *http.Request, dbClient *mongo.Client) {
	decoder := json.NewDecoder(request.Body)
	var candidateRecord CandidateRecord
	err := decoder.Decode(&candidateRecord)
	if err != nil {
		http.Error(writer, "Bad request", http.StatusInternalServerError)
	}

	collection := getCandidatesCollection(dbClient)

	if _, err := collection.InsertOne(context.Background(), candidateRecord); err != nil {
		http.Error(writer, fmt.Sprintf("Insert error %v", err), http.StatusInternalServerError)
		return
	}
}

func getCandidatesCollection(dbClient *mongo.Client) *mongo.Collection {
	return dbClient.Database("dutyDB").Collection("candidates")
}

func GetChore(writer http.ResponseWriter, request *http.Request, dbClient *mongo.Client) {
	writer.Header().Set("Content-Type", "application/json")
	choreCollection := dbClient.Database("dutyDB").Collection("chores")

	cursor, _ := choreCollection.Find(context.TODO(), bson.D{})
	var rows []CandidateRecord
	_ = cursor.All(context.TODO(), &rows)
	choreRows, _ := json.Marshal(rows)
	writer.Write(choreRows)
}

func InsertChore(record ChoreRecord) {
	dbClient, _ := GetDBClient()

	collection := dbClient.Database("dutyDB").Collection("chores")
	collection.InsertOne(context.Background(), record)
}

func InsertChoreFromHTTP(writer http.ResponseWriter, request *http.Request, dbClient *mongo.Client) {
	decoder := json.NewDecoder(request.Body)
	var choreRecord ChoreRecord
	err := decoder.Decode(&choreRecord)
	if err != nil {
		writer.WriteHeader(400)
	}

	collection := dbClient.Database("dutyDB").Collection("chores")
	collection.InsertOne(context.Background(), choreRecord)
}
