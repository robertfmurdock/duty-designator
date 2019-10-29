package routing

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
)

var ServeMux = initializeMux()

func initializeMux() http.Handler {
	client, err := getDBClient()
	if err != nil {
		log.Fatal(err)
		return nil
	}

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir("../client/build")))

	hc := handlerContext{dbClient: client}

	mux.Handle("/api/", http.StripPrefix("/api", apiMux(hc)))

	return mux
}

func apiMux(hc handlerContext) *http.ServeMux {
	apiMux := http.NewServeMux()
	apiMux.Handle("/pioneer", hc.methodRoute(pioneerHandler))
	apiMux.Handle("/chore", hc.methodRoute(choreMethodRoute))
	return apiMux
}

func getDBClient() (*mongo.Client, error) {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	err = client.Ping(context.Background(), nil)

	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	return client, nil
}

func writeAsJson(writer http.ResponseWriter, jsonStruct interface{}) error {
	writer.Header().Set("Content-Type", "application/json")
	choreRows, err := json.Marshal(jsonStruct)
	if err != nil {
		return err
	}
	_, err = writer.Write(choreRows)
	return err
}
