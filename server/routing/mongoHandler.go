package routing

import (
	"log"
	"net/http"
)

type mongoHandler func(writer http.ResponseWriter, request *http.Request, handlerContext *handlerContext) error

func (fn mongoHandler) handle(w http.ResponseWriter, r *http.Request, handlerContext *handlerContext) {
	if err := fn(w, r, handlerContext); err != nil {
		log.Println(err)
	}
}
