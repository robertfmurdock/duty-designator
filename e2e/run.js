const childProcess = require('child_process');

function buildClient() {
    childProcess.execSync("cd ../client && yarn build", {stdio: "inherit"});
}

function buildServer() {
    childProcess.execSync("cd ..; ./gradlew :server:goBuild", {stdio: "inherit"});
}

function spawnServer() {
    const serverSpawn = childProcess.spawn("../server/.gogradle/server", [], {detached: true, stdio: "inherit"});
    serverSpawn.on('exit', function () {
        process.exit()
    });
    return serverSpawn;
}

function runCypress() {
    try {
        childProcess.execSync("yarn run cypress run --reporter junit", {stdio: "inherit"});
    } catch (e) {
        console.log(e)
    }
}

function run() {
    buildClient();
    buildServer();
    const serverSpawn = spawnServer();
    runCypress();
    serverSpawn.kill();
}

run();