package main

import (
	"duty-designator/server/internal"
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Server start!")
	config := &internal.ServerConfig{ClientPath: "../client/build"}
	err := http.ListenAndServe("localhost:8080", internal.NewChoreWheelMux(config))
	if err != nil {
		log.Fatal(err)
	}
}
