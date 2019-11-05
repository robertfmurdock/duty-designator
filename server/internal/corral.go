package internal

import (
	"context"
	"encoding/json"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
	"path"
)

func corralHandler(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return getCorralHandler
	case http.MethodPut:
		return putCorralHandler
	}
	return unsupportedVerb
}

func unsupportedVerb(_ http.ResponseWriter, _ *http.Request, _ *handlerContext) error {
	return errors.New("nah")
}

type corralRecord struct {
	Date     string          `json:"date"`
	Pioneers []pioneerRecord `json:"pioneers"`
	Chores   []choreRecord   `json:"chores"`
}

func getCorralHandler(writer http.ResponseWriter, request *http.Request, handlerContext *handlerContext) error {
	date := path.Base(request.URL.Path)
	chores, err := loadCorral(date, handlerContext)
	if err != nil {
		return err
	}
	return writeAsJson(writer, chores)
}

func loadCorral(date string, handlerContext *handlerContext) (*corralRecord, error) {
	choreCollection := handlerContext.dutyDb().Collection("corrals")
	result := choreCollection.FindOne(context.Background(), bson.M{"date": date})

	if err := result.Err(); err != nil {
		return nil, err
	}

	var loadedRecord corralRecord
	if err := result.Decode(&loadedRecord); err != nil {
		return nil, err
	}
	return &loadedRecord, nil
}

func putCorralHandler(writer http.ResponseWriter, request *http.Request, handlerContext *handlerContext) error {
	decoder := json.NewDecoder(request.Body)
	var corral corralRecord

	if err := decoder.Decode(&corral); err != nil {
		writer.WriteHeader(400)
		return err
	}

	choreCollection := handlerContext.dutyDb().Collection("corrals")
	_, err := choreCollection.InsertOne(context.Background(), corral)
	return err
}
