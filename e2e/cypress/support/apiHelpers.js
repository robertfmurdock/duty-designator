export async function insertCorral(corral) {
    await fetch(`http://localhost:8080/api/corral/${corral.date}`, {
        method: "PUT",
        body: JSON.stringify(corral),
        signal: undefined
    });
}

export async function deleteCorral(date) {
    await fetch(`http://localhost:8080/api/corral/${date}`, {
        method: "DELETE",
        signal: undefined
    });
}