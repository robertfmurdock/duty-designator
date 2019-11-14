## Install Tools
- [Install go](https://golang.org/doc/install)
- [Install Node](https://nodejs.org/en/)
- `brew tap mongodb/brew`
- `brew install mongodb-community`

## Setup project

Clone the project into $GOPATH/src with the name duty-designator. This will ensure all go tools work correctly.

Then,
Ensure you have mongo installed and up and running.

Shell into the project directory and run:

    ./gradlew check

This will run all tests and verify the project works as intended.

To see what other things you can do with the project, run

    ./gradlew tasks --all


## Cypress Tests

- Go to the `server` directory
    - Start the MongoDB: `brew services start mongodb-community`
    - Start the Go Server: `go run main.go`
- In a second terminal, go to the `client` directory
    - Build the app: `yarn build`
- Go to the `e2e` directory
    - Run tests without Cypress GUI: `yarn run cypress run`
    - Run tests with Cypress GUI: `yarn run cypress open` 


### Initial MongoDB state

In `mongo` client first clear out the existing if you desire

```
use dutyDB
db.dropDatabase()
```

and from terminal shell

```
unzip initialData.zip
mongoimport --type=csv --file=chores.csv --headerline -ddutyDB -cchores
mongoimport --type=csv --file=pioneers.csv --headerline -ddutyDB -cpioneers
```

### Exposing local ports to external ips

Get your ip, e.g.

 `ifconfig en0 inet`
 
 Then

`<sudo> ssh <user>@localhost -L <your ip>:<external port>:127.0.0.1:8080`

Note:  sudo is only required for exposing ports below 1024

## Docker

### Initializing docker volume
Unzip `initialData.zip` and make sure it is in `initmongo/`

The docker volume for persistant data can be initialized or reset to a set of chores and pioneers with

```
docker build . -f Dockerfile-mongoinit
docker run -v duty-designator_dutydb-data:/data/db -v "$(pwd)"/initmongo/:/home/db <image>
```

### Starting docker
`docker-compose up`
