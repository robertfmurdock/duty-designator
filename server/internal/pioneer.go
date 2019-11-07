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

func pioneerHandler(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return getPioneerHandler
	case http.MethodPost:
		return postPioneerHandler
	}
	return nil
}

func pioneerByIdHandler(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return getPioneerByIdHandler
	case http.MethodDelete:
		return removePioneerByIdHandler
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

func getPioneerByIdHandler(writer http.ResponseWriter, request *http.Request, handlerContext *handlerContext) error {
	id := path.Base(request.URL.Path)
	record, err := loadSinglePioneerRecord(id, handlerContext, writer)
	if err != nil {
		return err
	}

	return writeAsJson(writer, record)
}

func removePioneerByIdHandler(writer http.ResponseWriter, request *http.Request, handlerContext *handlerContext) error {
	id := path.Base(request.URL.Path)
	if err := removeSinglePioneerRecord(id, handlerContext, writer); err != nil {
		return err
	}

	writer.WriteHeader(http.StatusOK)
	return nil
}

func loadSinglePioneerRecord(id string, handlerContext *handlerContext, writer http.ResponseWriter) (pioneerRecord, error) {
	collection := getPioneerCollection(handlerContext)
	singleResult := collection.FindOne(context.Background(), bson.M{"id": id})

	var row pioneerRecord

	err := singleResult.Decode(&row)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			row = pioneerRecord{}
		} else {
			http.Error(writer, err.Error(), http.StatusInternalServerError)
			log.Fatal(err)
		}
	}

	return row, err
}

func removeSinglePioneerRecord(id string, handlerContext *handlerContext, writer http.ResponseWriter) error {
	collection := getPioneerCollection(handlerContext)
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

func loadPioneerRecords(handlerContext *handlerContext, writer http.ResponseWriter) ([]pioneerRecord, error) {
	collection := getPioneerCollection(handlerContext)
	cursor, err := collection.Find(context.Background(), bson.D{})

	if err != nil {
		return nil, err
	}

	var rows []pioneerRecord
	err = cursor.All(context.Background(), &rows)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		log.Fatal(err)
	}
	if rows == nil {
		rows = []pioneerRecord{}
	}
	return rows, err
}

func postPioneerHandler(_ http.ResponseWriter, request *http.Request, handlerContext *handlerContext) error {
	decoder := json.NewDecoder(request.Body)
	var pioneerRecord pioneerRecord
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
