package routing

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"net/http"
)

func candidateHandler(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return getCandidateHandler
	case http.MethodPost:
		return postCandidateHandler
	}
	return nil
}

func getCandidateHandler(writer http.ResponseWriter, _ *http.Request, handlerContext *handlerContext) error {
	records, err := loadCandidateRecords(handlerContext, writer)
	if err != nil {
		return err
	}

	return writeAsJson(writer, records)
}

type CandidateRecord struct {
	Name string `json:"name"`
	Id   string `json:"id"`
}

func loadCandidateRecords(handlerContext *handlerContext, writer http.ResponseWriter) ([]CandidateRecord, error) {
	collection := getCandidatesCollection(handlerContext)
	cursor, err := collection.Find(context.Background(), bson.D{})

	if err != nil {
		return nil, err
	}

	var rows []CandidateRecord
	err = cursor.All(context.Background(), &rows)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		log.Fatal(err)
	}
	if rows == nil {
		rows = []CandidateRecord{}
	}
	return rows, err
}

func postCandidateHandler(_ http.ResponseWriter, request *http.Request, handlerContext *handlerContext) error {
	decoder := json.NewDecoder(request.Body)
	var candidateRecord CandidateRecord
	err := decoder.Decode(&candidateRecord)
	if err != nil {
		return err
	}

	collection := getCandidatesCollection(handlerContext)

	if _, err := collection.InsertOne(context.Background(), candidateRecord); err != nil {
		return err
	}

	return nil
}

func getCandidatesCollection(handlerContext *handlerContext) *mongo.Collection {
	return handlerContext.dutyDb().Collection("candidates")
}
