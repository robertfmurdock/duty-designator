package main

import (
	"duty-designator/server/src"
	"log"
	"net/http"
)

func main() {
	err := http.ListenAndServe(":8080", src.ServeMux)
	if err != nil {
		log.Fatal(err)
	}
}
