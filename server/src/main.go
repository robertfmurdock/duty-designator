package src

import (
	"io"
	"net/http"
)

type Candidate struct {
	Name string
}

func GetCandidatesHandler(writer http.ResponseWriter, reqest *http.Request) {
	writer.Header().Set("Content-Type", "application/json")

	io.WriteString(writer, `HI`)
}