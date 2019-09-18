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

type Row struct {
	Candidate string
	Task      string
	Id string `json:"id"`
}

func main() {
	http.HandleFunc("/", GetTaskAssignmentsHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
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

func GetTaskAssignmentsHandler(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Content-Type", "application/json")
	client, err := GetDBClient()

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		log.Fatal(err)
	}

	collection := client.Database("dutyDB").Collection("assignments")
	cursor, err := collection.Find(context.TODO(), bson.D{{"Candidate", "bob"}})

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		log.Fatal(err)
	}

	var rows []Row
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
