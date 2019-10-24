package main

import (
	"duty-designator/server/routing"
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Server start!")
	err := http.ListenAndServe("localhost:8080", routing.ServeMux)
	if err != nil {
		log.Fatal(err)
	}
}
