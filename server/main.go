package main

import (
	"duty-designator/server/internal"
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Server start!")
	err := http.ListenAndServe("localhost:8080", internal.ServeMux)
	if err != nil {
		log.Fatal(err)
	}
}
