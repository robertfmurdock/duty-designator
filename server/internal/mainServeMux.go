package internal

import (
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
)

type ServerConfig struct {
	ClientPath string
}

func NewChoreWheelMux(serverConfig *ServerConfig) http.Handler {
	client, err := getDBClient()
	if err != nil {
		log.Fatal(err)
		return nil
	}
	mux := http.NewServeMux()
	mux.Handle("/build/", http.StripPrefix("/build", buildDirectoryHandler(serverConfig)))

	hc := handlerContext{dbClient: client}

	mux.Handle("/api/", http.StripPrefix("/api", apiMux(hc)))
	mux.Handle("/", indexHtmlHandler(serverConfig))

	return mux
}

func buildDirectoryHandler(config *ServerConfig) http.Handler {
	return http.FileServer(http.Dir(config.ClientPath))
}

func indexHtmlHandler(config *ServerConfig) http.Handler {
	indexHtmlPath := fmt.Sprintf("%v/index.html", config.ClientPath)
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		http.ServeFile(writer, request, indexHtmlPath)
	})
}

func apiMux(hc handlerContext) *http.ServeMux {
	apiMux := http.NewServeMux()
	apiMux.Handle("/pioneer", hc.methodRoute(pioneerHandler))
	apiMux.Handle("/pioneer/", hc.methodRoute(pioneerByIdHandler))
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
