package routing

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
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

func getChoresHandler(writer http.ResponseWriter, _ *http.Request, handlerContext *handlerContext) error {
	chores, err := loadChoreRecords(handlerContext)
	if err != nil {
		return err
	}

	return writeAsJson(writer, chores)
}

type ChoreRecord struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Id          string `json:"id"`
}

func loadChoreRecords(handlerContext *handlerContext) ([]ChoreRecord, error) {
	choreCollection := handlerContext.dutyDb().Collection("chores")
	cursor, err := choreCollection.Find(context.Background(), bson.D{})
	if err != nil {
		return nil, err
	}
	var rows []ChoreRecord
	if err = cursor.All(context.Background(), &rows); err != nil {
		return nil, err
	}
	if rows != nil {
		return rows, nil
	}
	return []ChoreRecord{}, nil
}

func postChoreHandler(writer http.ResponseWriter, request *http.Request, handlerContext *handlerContext) error {
	decoder := json.NewDecoder(request.Body)
	var choreRecord ChoreRecord

	if err := decoder.Decode(&choreRecord); err != nil {
		writer.WriteHeader(400)
		return err
	}

	collection := handlerContext.dutyDb().Collection("chores")
	_, err := collection.InsertOne(context.Background(), choreRecord)
	return err
}
