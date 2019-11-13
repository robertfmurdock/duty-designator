package main

import (
	"duty-designator/server/internal"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	fmt.Println("Server start!")
	config := &internal.ServerConfig{ClientPath: "../client/build"}
	serverHost := os.Getenv("DUTY_HOST")
	if serverHost == "" {
		serverHost = "localhost"
	}
	err := http.ListenAndServe(serverHost+":8080", internal.NewChoreWheelMux(config))
	if err != nil {
		log.Fatal(err)
	}
}
