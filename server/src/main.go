package src

import (
	"context"
	"encoding/json"
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

func main() {

}

func initializeMux() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/candidate", candidateHandler)
	return mux
}

func candidateHandler(writer http.ResponseWriter, request *http.Request) {
	switch request.Method {
	case http.MethodGet:
		getTaskAssignmentsHandler(writer, request)
	case http.MethodPost:
		postTaskAssignmentsHandler(writer, request)
	}
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

func DisconnectClient(client *mongo.Client) error {
	err := client.Disconnect(context.TODO())

	if err != nil {
		log.Fatal(err)
		return err
	}

	return nil
}

func getTaskAssignmentsHandler(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Content-Type", "application/json")
	client, err := GetDBClient()

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		log.Fatal(err)
	}

	collection := client.Database("dutyDB").Collection("assignments")
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
	_ = DisconnectClient(client)
}

func postTaskAssignmentsHandler(writer http.ResponseWriter, request *http.Request) {
	decoder := json.NewDecoder(request.Body)
	var t CandidateRecord
	err := decoder.Decode(&t)
	if err != nil {
		http.Error(writer, "Bad request", http.StatusInternalServerError)
	}

	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		http.Error(writer, "Bad DB Connection", http.StatusInternalServerError)
		return
	}

	collection := client.Database("dutyDB").Collection("assignments")

	if _, err := collection.InsertOne(context.Background(), t); err != nil {
		http.Error(writer, "Insert error", http.StatusInternalServerError)
		return
	}
}
