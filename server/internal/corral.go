package internal

import (
	"context"
	"encoding/json"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
	"path"
	"time"
)

func corralHandler(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return getCorralHandler
	case http.MethodPut:
		return putCorralHandler
	case http.MethodDelete:
		return deleteCorralHandler
	}
	return unsupportedVerb
}

func unsupportedVerb(_ http.ResponseWriter, _ *http.Request, _ *handlerContext) error {
	return errors.New("unsupported request method")
}

func getCorralHandler(writer http.ResponseWriter, request *http.Request, handlerContext *handlerContext) error {
	date := path.Base(request.URL.Path)
	record, err := loadCorralRecord(date, handlerContext)
	if err != nil {
		return err
	}

	if record.isRemoved() {
		writer.WriteHeader(http.StatusNotFound)
		return nil
	}

	jsonStruct := record.toPresentation()
	return writeAsJson(writer, jsonStruct)
}

func (corralRecord *corralRecord) isRemoved() bool {
	if corralRecord == nil {
		return true
	}
	return corralRecord.RecordType == removed
}

func deleteCorralHandler(writer http.ResponseWriter, request *http.Request, hc *handlerContext) error {
	date := path.Base(request.URL.Path)
	if err := insertRemoveCorralRecord(date, time.Now(), hc); err != nil {
		return err
	}
	writer.WriteHeader(http.StatusOK)
	return nil
}

func loadCorralRecord(date string, handlerContext *handlerContext) (*corralRecord, error) {
	choreCollection := handlerContext.dutyDb().Collection("corrals")
	result := choreCollection.FindOne(context.Background(), bson.M{"date": date},
		&options.FindOneOptions{Sort: bson.M{"timestamp": -1}})

	if result.Err() == mongo.ErrNoDocuments {
		return nil, nil
	}

	if err := result.Err(); err != nil {
		return nil, err
	}

	var loadedRecord corralRecord
	if err := result.Decode(&loadedRecord); err != nil {
		return nil, err
	}
	return &loadedRecord, nil
}

func putCorralHandler(writer http.ResponseWriter, request *http.Request, hc *handlerContext) error {
	decoder := json.NewDecoder(request.Body)
	var corral corralRecord

	if err := decoder.Decode(&corral); err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		return err
	}

	corral.Timestamp = time.Now()
	return saveCorral(corral, hc)
}

func saveCorral(record corralRecord, hc *handlerContext) error {
	choreCollection := hc.dutyDb().Collection("corrals")
	_, err := choreCollection.InsertOne(context.Background(), record)
	return err
}

func insertRemoveCorralRecord(recordDate string, timestamp time.Time, hc *handlerContext) error {
	removeRecord := corralRecord{
		Date:       recordDate,
		Timestamp:  timestamp,
		RecordType: removed,
	}
	return saveCorral(removeRecord, hc)
}
