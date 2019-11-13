FROM golang:latest

WORKDIR /go/src/duty-designator/server
COPY server .
COPY client/build ../client/build

RUN go run main.go
EXPOSE 8080
