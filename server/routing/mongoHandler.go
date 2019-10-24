package routing

import (
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"net/http"
)

type mongoHandler func(writer http.ResponseWriter, request *http.Request, dbClient *mongo.Client) error

func (fn mongoHandler) handle(w http.ResponseWriter, r *http.Request, dbClient *mongo.Client) {
	if err := fn(w, r, dbClient); err != nil {
		log.Println(err)
	}
}
