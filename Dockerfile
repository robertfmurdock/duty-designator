FROM golang:latest

WORKDIR /go/src/duty-designator/

RUN mkdir client
COPY client/package.json ./client
COPY client/yarn.lock ./client
COPY client/src ./client/src
COPY client/public ./client/public

RUN mkdir server
COPY server/main.go ./server
COPY server/internal ./server/internal
COPY scripts/ ./

ENV DUTY_HOST=duty-designator
ENV DUTY_MONGODB=mongodb

RUN apt-get update
RUN yes | apt-get install nodejs npm
RUN npm install -g yarn
RUN ./build-server.sh
RUN ./build-client.sh

CMD ./run-server.sh
EXPOSE 8080
