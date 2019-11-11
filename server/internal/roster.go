package internal

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
	"path"
	"time"
)

func rosterHandler(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return getRosterHandler
	case http.MethodPut:
		return putRosterHandler
	case http.MethodDelete:
		return deleteRosterHandler
	}
	return unsupportedVerb
}

func getRosterHandler(writer http.ResponseWriter, request *http.Request, hc *handlerContext) error {
	date := path.Base(request.URL.Path)
	record, err := loadRosterRecord(date, hc)

	if err != nil {
		return err
	}

	if record == nil || record.RecordType == removed {
		writer.WriteHeader(http.StatusNotFound)
		return nil
	}

	return writeAsJson(writer, record.toPresentation())
}

func putRosterHandler(_ http.ResponseWriter, request *http.Request, hc *handlerContext) error {
	decoder := json.NewDecoder(request.Body)

	var roster presentationDutyRoster
	if err := decoder.Decode(&roster); err != nil {
		return err
	}

	return saveRoster(roster.toRecord(), hc)
}

func deleteRosterHandler(_ http.ResponseWriter, request *http.Request, hc *handlerContext) error {
	date := path.Base(request.URL.Path)
	roster := dutyRosterRecord{
		Date:       date,
		Timestamp:  time.Now(),
		RecordType: removed,
	}

	return saveRoster(roster, hc)
}

func saveRoster(dutyRoster dutyRosterRecord, hc *handlerContext) error {
	dutyCollection := hc.dutyDb().Collection("rosters")
	_, err := dutyCollection.InsertOne(context.Background(), dutyRoster)
	return err
}

func loadRosterRecord(date string, hc *handlerContext) (*dutyRosterRecord, error) {
	dutyCollection := hc.dutyDb().Collection("rosters")
	result := dutyCollection.FindOne(context.Background(), bson.M{"date": date},
		&options.FindOneOptions{Sort: bson.M{"timestamp": -1}})

	if result.Err() == mongo.ErrNoDocuments {
		return nil, nil
	}

	var roster dutyRosterRecord
	if err := result.Decode(&roster); err != nil {
		return nil, err
	}

	return &roster, nil
}

func insertRemoveRosterRecord(recordDate string, timestamp time.Time, hc *handlerContext) error {
	removeRecord := dutyRosterRecord{
		Date:       recordDate,
		Timestamp:  timestamp,
		RecordType: removed,
	}
	return saveRoster(removeRecord, hc)
}
