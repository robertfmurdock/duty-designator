const childProcess = require('child_process');

function spawnServer() {
    const serverSpawn = childProcess.spawn("../server/.gogradle/server", [], {detached: true, stdio: "inherit"});
    serverSpawn.on('exit', function () {
        process.exit()
    });
    return serverSpawn;
}

function runCypress() {
    childProcess.execSync("yarn run cypress run --reporter junit", {stdio: "inherit"});
}

function run() {
    const serverSpawn = spawnServer();
    try {
        runCypress();
    } catch (e) {
        console.log(e);
        throw e;
    } finally {
        serverSpawn.kill();
    }

}

try {
    run();
} catch (e) {
    process.exit(e)
}