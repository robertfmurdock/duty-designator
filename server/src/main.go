package src

import (
	"encoding/json"
	"log"
	"net/http"
)

type Row struct {
	Candidate string
	Task string
}

func main() {
	http.HandleFunc("/", GetTaskAssignmentsHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func GetTaskAssignmentsHandler(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Content-Type", "application/json")

	var rows []Row
	rows = append(rows, Row{Candidate:"bob", Task:"dishes"} )
	candidateJson, err := json.Marshal(rows)
	//io.WriteString(writer, string(candidateJson))

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.Write(candidateJson)
}