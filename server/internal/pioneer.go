package internal

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"net/http"
)

func pioneerHandler(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return getPioneerHandler
	case http.MethodPost:
		return postPioneerHandler
	}
	return nil
}

func getPioneerHandler(writer http.ResponseWriter, _ *http.Request, handlerContext *handlerContext) error {
	records, err := loadPioneerRecords(handlerContext, writer)
	if err != nil {
		return err
	}

	return writeAsJson(writer, records)
}

type PioneerRecord struct {
	Name string `json:"name"`
	Id   string `json:"id"`
}

func loadPioneerRecords(handlerContext *handlerContext, writer http.ResponseWriter) ([]PioneerRecord, error) {
	collection := getPioneerCollection(handlerContext)
	cursor, err := collection.Find(context.Background(), bson.D{})

	if err != nil {
		return nil, err
	}

	var rows []PioneerRecord
	err = cursor.All(context.Background(), &rows)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		log.Fatal(err)
	}
	if rows == nil {
		rows = []PioneerRecord{}
	}
	return rows, err
}

func postPioneerHandler(_ http.ResponseWriter, request *http.Request, handlerContext *handlerContext) error {
	decoder := json.NewDecoder(request.Body)
	var pioneerRecord PioneerRecord
	err := decoder.Decode(&pioneerRecord)
	if err != nil {
		return err
	}

	collection := getPioneerCollection(handlerContext)

	if _, err := collection.InsertOne(context.Background(), pioneerRecord); err != nil {
		return err
	}

	return nil
}

func getPioneerCollection(handlerContext *handlerContext) *mongo.Collection {
	return handlerContext.dutyDb().Collection("pioneers")
}
