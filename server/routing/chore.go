package routing

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

func choreMethodRoute(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return getChoresHandler
	case http.MethodPost:
		return postChoreHandler
	}
	return nil
}

func getChoresHandler(writer http.ResponseWriter, _ *http.Request, dbClient *mongo.Client) error {
	chores, err := loadChoreRecords(dbClient)
	if err != nil {
		return err
	}

	return writeAsJson(writer, chores)
}

type ChoreRecord struct {
	Name string `json:"name"`
	Id   string `json:"id"`
}

func loadChoreRecords(dbClient *mongo.Client) ([]ChoreRecord, error) {
	choreCollection := dbClient.Database("dutyDB").Collection("chores")
	cursor, err := choreCollection.Find(context.Background(), bson.D{})
	if err != nil {
		return nil, err
	}
	var rows []ChoreRecord
	err = cursor.All(context.Background(), &rows)
	if err != nil {
		return nil, err
	}
	if rows == nil {
		rows = []ChoreRecord{}
	}
	return rows, nil
}

func postChoreHandler(writer http.ResponseWriter, request *http.Request, dbClient *mongo.Client) error {
	decoder := json.NewDecoder(request.Body)
	var choreRecord ChoreRecord
	err := decoder.Decode(&choreRecord)
	if err != nil {
		writer.WriteHeader(400)
		return err
	}

	collection := dbClient.Database("dutyDB").Collection("chores")
	_, err = collection.InsertOne(context.Background(), choreRecord)
	return err
}
