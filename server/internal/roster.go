package internal

import (
	"context"
	"encoding/json"
	"github.com/google/go-cmp/cmp"
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

	if cmp.Equal(date, "/") {
		return getRosterList(hc, writer)
	} else {
		return getRosterById(date, hc, writer)
	}
}

func getRosterList(hc *handlerContext, writer http.ResponseWriter) error {
	records, err := loadRosterRecordList(hc)
	if err != nil {
		return err
	}

	presentationRosters := make([]presentationDutyRoster, len(records))
	for index, thing := range records {
		presentationRosters[index] = thing.toPresentation()
	}
	return writeAsJson(writer, presentationRosters)
}

func getRosterById(date string, hc *handlerContext, writer http.ResponseWriter) error {
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
	dutyCollection := hc.rosterCollection()
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

func (hc *handlerContext) rosterCollection() *mongo.Collection {
	return hc.dutyDb().Collection("rosters")
}

func loadRosterRecordList(hc *handlerContext) ([]dutyRosterRecord, error) {
	dutyCollection := hc.rosterCollection()
	cursor, err := dutyCollection.Find(context.Background(), bson.M{}, &options.FindOptions{Sort: bson.M{"timestamp": 1}})
	if err != nil {
		return nil, err
	}

	var closeErr error
	defer func() { closeErr = cursor.Close(context.Background()) }()

	var records []dutyRosterRecord
	if err := cursor.All(context.Background(), &records); err != nil {
		return nil, err
	}
	return getUniqueRecords(records), closeErr
}

func getUniqueRecords(records []dutyRosterRecord) []dutyRosterRecord {
	theMap := map[string]dutyRosterRecord{}
	for _, record := range records {
		theMap[record.Date] = record
	}
	uniqueRecords := make([]dutyRosterRecord, 0, len(theMap))
	for _, thing := range theMap {
		uniqueRecords = append(uniqueRecords, thing)
	}
	return uniqueRecords
}

func insertRemoveRosterRecord(recordDate string, timestamp time.Time, hc *handlerContext) error {
	removeRecord := dutyRosterRecord{
		Date:       recordDate,
		Timestamp:  timestamp,
		RecordType: removed,
	}
	return saveRoster(removeRecord, hc)
}
