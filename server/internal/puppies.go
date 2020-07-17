package internal

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

func puppyHandler(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return puppyGetHandler
	case http.MethodPost:
		return puppyPostHandler
	case http.MethodDelete:
	}
	return unsupportedVerb
}

func puppyGetHandler(writer http.ResponseWriter, request *http.Request, context *handlerContext) error {

	puppies, err := getPuppies(context.dutyDb())

	if err != nil {
		return err
	}

	return writeAsJson(writer, puppies)
}

func puppyPostHandler(writer http.ResponseWriter, request *http.Request, context *handlerContext) error {
	decoder := json.NewDecoder(request.Body)
	var puppy puppyRecord

	if err := decoder.Decode(&puppy); err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return err
	}

	return savePuppy(context.dutyDb(), puppy)
}

func savePuppy(database *mongo.Database, record puppyRecord) error {
	return insertIntoCollection(database, record, "pound")
}

func getPuppies(database *mongo.Database) ([]puppyRecord, error) {
	var records []puppyRecord
	collection := database.Collection("pound")

	cursor, err := collection.Find(context.Background(), bson.D{})

	if err != nil {
		return nil, err
	}

	if err = cursor.All(context.Background(), &records); err != nil {
		return nil, err
	}

	return records, nil
}
