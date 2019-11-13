import {format} from "date-fns";
import {apiDateFormat} from "./stubs";

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


export async function insertRoster(roster) {
    await fetch(`http://localhost:8080/api/roster/${roster.date}`, {
        method: "PUT",
        body: JSON.stringify(roster)
    });
}

export async function deleteRoster(date) {
    await fetch(`http://localhost:8080/api/roster/${date}`, {
        method: "DELETE"
    });
}

export function setLocalStorageDutyRoster(date, dutyRoster) {
    localStorage.setItem(date, JSON.stringify({dutyRoster}));
}

export async function deleteToday() {
    const today = format(new Date(), apiDateFormat);
    await deleteCorral(today);
    await deleteRoster(today);
}
