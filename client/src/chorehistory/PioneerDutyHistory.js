import React, {useState} from 'react';
import {Typography} from "@material-ui/core";
import FetchService from "../utilities/services/fetchService";
import {loadStuff} from "../utilities/services/localStorageService";
import DutyHistoryTable from "./DutyHistoryTable";

export default function PioneerDutyHistory(props) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [pioneer, setPioneer] = useState(undefined);
    const [choreCounts, setChoreCounts] = useState([]);

    if (!dataLoaded) {
        setPioneerFromServer(props.id, pioneer, setPioneer);
        setPioneerFromLocalStorage(props.id, setPioneer, setChoreCounts);
        setDataLoaded(true); // will need to be moved to take async fetch into account
    }

    return <div>
        <Typography variant="h1" className="history-header">Pioneer History</Typography>
        {conditionalRender(pioneer, choreCounts)}
    </div>;
}

const conditionalRender = (pioneer, choreCounts) => (
    pioneer
        ? <DutyHistoryTable pioneer={pioneer} choreCounts={choreCounts}/>
        : <Typography
            variant="body1"
            color="textPrimary"
            className="no-pioneer"
        >
            No pioneer data found
        </Typography>
);

function flattenList(rosters) {
    return [].concat.apply([], rosters);
}

function generateInitialChoreCount(chore) {
    return Object.assign(chore, {count: 1});
}

function matchChoreById(choreId) {
    return choreCount => choreCount.id === choreId;
}

function accumulateChoreCount(acc, chore) {
    const countedChore = acc.find(matchChoreById(chore.id));
    if (countedChore) {
        countedChore.count++;
    } else {
        acc.push(generateInitialChoreCount(chore));
    }
}

function countChoreFrequency(duties) {
    return duties.reduce((acc, duty) => {
        const chore = duty.chore;
        accumulateChoreCount(acc, chore);
        return acc;
    }, []);
}

function setPioneerFromLocalStorage(id, setPioneer, setChoreCounts) {
    let rosters = Object.keys(localStorage)
        .map(date => loadStuff(date).dutyRoster)
        .filter(roster => roster !== false);

    let duties = flattenList(rosters);

    const dutyWithMatchedPioneerId = duties.find(duty => duty.pioneer.id === id);

    if (dutyWithMatchedPioneerId) {
        let choresWithCounts = countChoreFrequency(duties);

        choresWithCounts.sort((a,b) => a.count - b.count);
        setPioneer(dutyWithMatchedPioneerId.pioneer);
        setChoreCounts(choresWithCounts);
    }
}

function setPioneerFromServer(id, currentPioneer, setPioneer) {
    FetchService.get(0, `/api/pioneer/${id}`, undefined)
        .then(pioneer => {
            if(!currentPioneer) {
                setPioneer(pioneer);
            }
        })
        .catch(err => console.warn("Problem fetching pioneer", err));
}