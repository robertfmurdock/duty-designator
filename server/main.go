package main

import (
	"duty-designator/server/src"
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Server start!")
	err := http.ListenAndServe(":8080", src.ServeMux)
	if err != nil {
		log.Fatal(err)
	}
}
