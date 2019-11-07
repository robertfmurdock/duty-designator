export async function insertPioneer(pioneer) {
    await fetch("http://localhost:8080/api/pioneer", {
        method: "POST",
        body: JSON.stringify(pioneer)
    });
}

export async function removePioneer(pioneer) {
    await fetch(`http://localhost:8080/api/pioneer/${pioneer.id}`, {
        method: "DELETE"
    });
}

export async function insertChore(chore) {
    await fetch("http://localhost:8080/api/chore", {
        method: "POST",
        body: JSON.stringify(chore)
    });
}

export async function removeChore(chore) {
    await fetch(`http://localhost:8080/api/chore/${chore.id}`, {
        method: "DELETE"
    });
}

export function setLocalStorageDutyRoster(date, dutyRoster) {
    localStorage.setItem(date, JSON.stringify({dutyRoster}));
}