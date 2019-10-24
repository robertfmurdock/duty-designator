package routing

import (
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"net/http"
)

type handlerContext struct {
	dbClient *mongo.Client
}

func (hc *handlerContext) methodRoute(methodRouteFunc func(request *http.Request) mongoHandler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		hc.toHandler(methodRouteFunc(request)).ServeHTTP(writer, request)
	})
}

func (hc *handlerContext) toHandler(fn mongoHandler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		if err := fn(writer, request, hc.dbClient); err != nil {
			log.Println(err)
			http.Error(writer, err.Error(), http.StatusInternalServerError)
		}
	})
}
