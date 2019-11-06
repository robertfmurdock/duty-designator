export async function insertCandidate(candidate) {
    await fetch("http://localhost:8080/api/pioneer", {
        method: "POST",
        body: JSON.stringify(candidate),
        signal: undefined
    });
}

export async function insertChore(chore) {
    await fetch("http://localhost:8080/api/chore", {
        method: "POST",
        body: JSON.stringify(chore),
        signal: undefined
    });
}