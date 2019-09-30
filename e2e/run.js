const childProcess = require('child_process');

function buildClient() {
    childProcess.execSync("cd ../client && yarn build", {stdio: "inherit"});
}

function buildServer() {
    childProcess.execSync("cd ../server && go build", {stdio: "inherit"});
}

function spawnServer() {
    const serverSpawn = childProcess.spawn("../server/server", [], {detached: true, stdio: "inherit"});
    serverSpawn.on('exit', function () {
        process.exit()
    });
    return serverSpawn;
}

function runCypress() {
    try {
        childProcess.execSync("cd ../e2e && yarn run cypress run", {stdio: "inherit"});
    } catch (e) {
        console.log(e)
    }
}

function run() {
    buildClient();
    buildServer();
    const serverSpawn = spawnServer();
    // runCypress();
    serverSpawn.kill();
}

run();