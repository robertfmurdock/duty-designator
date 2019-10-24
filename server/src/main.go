package src

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
)

var ServeMux = initializeMux()

type CandidateRecord struct {
	Name string `json:"name"`
	Id   string `json:"id"`
}

type ChoreRecord struct {
	Name string `json:"name"`
	Id   string `json:"id"`
}

func initializeMux() http.Handler {
	client, err := getDBClient()
	if err != nil {
		log.Fatal(err)
		return nil
	}

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir("../client/build")))

	hc := handlerContext{dbClient: client}
	mux.Handle("/api/candidate", hc.methodRoute(candidateHandler))
	mux.Handle("/api/chore", hc.methodRoute(choreMethodRoute))
	return mux
}

type handlerContext struct {
	dbClient *mongo.Client
}

func candidateHandler(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return getCandidateHandler
	case http.MethodPost:
		return postCandidateHandler
	}
	return nil
}

func (hc *handlerContext) methodRoute(methodRouteFunc func(request *http.Request) mongoHandler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		hc.toHandler(methodRouteFunc(request)).ServeHTTP(writer, request)
	})
}

func choreMethodRoute(request *http.Request) mongoHandler {
	switch request.Method {
	case http.MethodGet:
		return GetChore
	case http.MethodPost:
		return InsertChoreFromHTTP
	}
	return nil
}

func getDBClient() (*mongo.Client, error) {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	return client, nil
}

func getCandidateHandler(writer http.ResponseWriter, _ *http.Request, dbClient *mongo.Client) error {
	writer.Header().Set("Content-Type", "application/json")

	collection := getCandidatesCollection(dbClient)
	cursor, err := collection.Find(context.TODO(), bson.D{})

	if err != nil {
		return err
	}

	records, err := loadCandidateRecords(cursor, writer)

	if err != nil {
		return err
	}

	candidateJson, err := json.Marshal(records)

	if err != nil {
		return err
	}

	writer.Header().Set("Content-Type", "application/json")
	_, err = writer.Write(candidateJson)
	return err
}

func loadCandidateRecords(cursor *mongo.Cursor, writer http.ResponseWriter) ([]CandidateRecord, error) {
	var rows []CandidateRecord
	err := cursor.All(context.TODO(), &rows)
	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		log.Fatal(err)
	}
	if rows == nil {
		rows = []CandidateRecord{}
	}
	return rows, err
}

func postCandidateHandler(_ http.ResponseWriter, request *http.Request, dbClient *mongo.Client) error {
	decoder := json.NewDecoder(request.Body)
	var candidateRecord CandidateRecord
	err := decoder.Decode(&candidateRecord)
	if err != nil {
		return err
	}

	collection := getCandidatesCollection(dbClient)

	if _, err := collection.InsertOne(context.Background(), candidateRecord); err != nil {
		return err
	}

	return nil
}

func getCandidatesCollection(dbClient *mongo.Client) *mongo.Collection {
	return dbClient.Database("dutyDB").Collection("candidates")
}

func GetChore(writer http.ResponseWriter, _ *http.Request, dbClient *mongo.Client) error {
	writer.Header().Set("Content-Type", "application/json")
	choreCollection := dbClient.Database("dutyDB").Collection("chores")

	cursor, err := choreCollection.Find(context.TODO(), bson.D{})

	if err != nil {
		return err
	}

	var rows []CandidateRecord
	err = cursor.All(context.TODO(), &rows)
	if err != nil {
		return err
	}

	if rows == nil {
		rows = []CandidateRecord{}
	}

	choreRows, err := json.Marshal(rows)

	if err != nil {
		return err
	}

	_, err = writer.Write(choreRows)
	return err
}

func InsertChoreFromHTTP(writer http.ResponseWriter, request *http.Request, dbClient *mongo.Client) error {
	decoder := json.NewDecoder(request.Body)
	var choreRecord ChoreRecord
	err := decoder.Decode(&choreRecord)
	if err != nil {
		writer.WriteHeader(400)
	}

	collection := dbClient.Database("dutyDB").Collection("chores")
	_, err = collection.InsertOne(context.Background(), choreRecord)
	return err
}

type mongoHandler func(writer http.ResponseWriter, request *http.Request, dbClient *mongo.Client) error

func (fn mongoHandler) handle(w http.ResponseWriter, r *http.Request, dbClient *mongo.Client) {
	if err := fn(w, r, dbClient); err != nil {
		log.Println(err)
	}
}

func (hc *handlerContext) toHandler(fn mongoHandler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if err := fn(writer, request, hc.dbClient); err != nil {
			log.Println(err)
			http.Error(writer, err.Error(), http.StatusInternalServerError)
		}
	})
}
