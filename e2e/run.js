const childProcess = require('child_process');

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
    const serverSpawn = spawnServer();
    runCypress();
    serverSpawn.kill();
}

run();