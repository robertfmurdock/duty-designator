FROM golang:latest

WORKDIR /go/src/duty-designator/server
COPY server/ .
COPY client/build ../client/build
ENV DUTY_HOST=duty-designator
ENV DUTY_MONGODB=mongodb

RUN go build main.go
CMD go run main.go
EXPOSE 8080
