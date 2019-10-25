## Install Tools
- [Install go](https://golang.org/doc/install)
- [Install Node](https://nodejs.org/en/)
- `brew install dep`
- `brew tap mongodb/brew`
- `brew install mongodb-community`

## Setup project

Clone the project into somewhere within your $GOPATH/src, so that the Go tools work correctly.

Then,

In the server directory

- `dep ensure`

In the client directory

- `yarn install`

## Cypress Tests

- Go to the `server` directory
    - Start the MongoDB: `brew services start mongodb-community`
    - Start the Go Server: `go run main.go`
- In a second terminal, go to the `client` directory
    - Build the app: `yarn build`
- Go to the `e2e` directory
    - Run tests without Cypress GUI: `yarn run cypress run`
    - Run tests with Cypress GUI: `yarn run cypress open` 

## MongoDB

In the `server` directory:<br>
Start MongoDB: `brew services start mongodb-community`<br>
Stop MongoDB: `brew services stop mongodb-community`

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
mongoimport --type=csv --file=pioneers.csv --headerline -ddutyDB -ccandidates
```

## React Scripts

In the `client` directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!


### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
