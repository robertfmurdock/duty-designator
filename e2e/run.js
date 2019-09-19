#!/usr/local/bin/node

const childProcess = require('child_process');

function run() {

    // build client
    childProcess.execSync("cd ../client && yarn build", {stdio: "inherit"});

    // start server

    const serverProcess = childProcess.exec("go run ../server", function (error, stdout, stderr) {
        serverProcess.stdout.pipe(process.stdout);
    });

    // run cypress
    childProcess.execSync("cd ../e2e && npx cypress run", {stdio: "inherit"});

    // kill server & wait for stop
    serverProcess.on('close', function () {
        console.log("closing!", arguments);
        process.exit()
    });

    serverProcess.kill();
    console.log("Kill command has been deployed.")
}


run();