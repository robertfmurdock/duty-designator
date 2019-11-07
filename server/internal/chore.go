package internal

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"net/http"
	"path"
)

func choreHandler(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return getChoresHandler
	case http.MethodPost:
		return postChoreHandler
	}
	return nil
}

func choreByIdHandler(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodDelete:
		return removeChoreByIdHandler
	}
	return nil
}

func getChoresHandler(writer http.ResponseWriter, _ *http.Request, handlerContext *handlerContext) error {
	chores, err := loadChoreRecords(handlerContext)
	if err != nil {
		return err
	}

	return writeAsJson(writer, chores)
}

type choreRecord struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Id          string `json:"id"`
	Title       string `json:"title"`
}

func loadChoreRecords(handlerContext *handlerContext) ([]choreRecord, error) {
	choreCollection := handlerContext.dutyDb().Collection("chores")
	cursor, err := choreCollection.Find(context.Background(), bson.D{})
	if err != nil {
		return nil, err
	}
	var choreRecords []choreRecord
	if err = cursor.All(context.Background(), &choreRecords); err != nil {
		return nil, err
	}
	if choreRecords != nil {
		return choreRecords, nil
	}
	return []choreRecord{}, nil
}

func postChoreHandler(writer http.ResponseWriter, request *http.Request, handlerContext *handlerContext) error {
	decoder := json.NewDecoder(request.Body)
	var choreRecord choreRecord

	if err := decoder.Decode(&choreRecord); err != nil {
		writer.WriteHeader(400)
		return err
	}

	collection := handlerContext.dutyDb().Collection("chores")
	_, err := collection.InsertOne(context.Background(), choreRecord)
	return err
}

func removeChoreByIdHandler(writer http.ResponseWriter, request *http.Request, handlerContext *handlerContext) error {
	id := path.Base(request.URL.Path)
	if err := removeSingleChoreRecord(id, handlerContext, writer); err != nil {
		return err
	}

	writer.WriteHeader(http.StatusOK)
	return nil
}

func removeSingleChoreRecord(id string, handlerContext *handlerContext, writer http.ResponseWriter) error {
	collection := getChoreCollection(handlerContext)
	deleteResult, err := collection.DeleteOne(context.Background(), bson.M{"id": id})

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		log.Fatal(err)
	}

	if deleteResult.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return err
}

func getChoreCollection(handlerContext *handlerContext) *mongo.Collection {
	return handlerContext.dutyDb().Collection("chores")
}
