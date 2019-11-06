export async function insertPioneer(pioneer) {
    await fetch("http://localhost:8080/api/pioneer", {
        method: "POST",
        body: JSON.stringify(pioneer)
    });
}

export async function insertChore(chore) {
    await fetch("http://localhost:8080/api/chore", {
        method: "POST",
        body: JSON.stringify(chore)
    });
}

export async function removePioneer(pioneer) {
    await fetch(`http://localhost:8080/api/pioneer/${pioneer.id}`, {
        method: "DELETE"
    });
}