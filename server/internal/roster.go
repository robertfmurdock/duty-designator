package internal

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
	"path"
)

func rosterHandler(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return getRosterHandler
	case http.MethodPut:
		return putRosterHandler
	}
	return unsupportedVerb
}

func getRosterHandler(writer http.ResponseWriter, request *http.Request, hc *handlerContext) error {
	date := path.Base(request.URL.Path)
	record, err := loadRosterRecord(date, hc)
	if err != nil {
		return err
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

func saveRoster(dutyRoster dutyRosterRecord, hc *handlerContext) error {
	dutyCollection := hc.dutyDb().Collection("rosters")
	_, err := dutyCollection.InsertOne(context.Background(), dutyRoster)
	return err
}

func loadRosterRecord(date string, hc *handlerContext) (*dutyRosterRecord, error) {
	dutyCollection := hc.dutyDb().Collection("rosters")
	result := dutyCollection.FindOne(context.Background(), bson.M{"date": date},
		&options.FindOneOptions{Sort: bson.M{"timestamp": -1}})

	var roster dutyRosterRecord
	if err := result.Decode(&roster); err != nil {
		return nil, err
	}

	return &roster, nil
}
