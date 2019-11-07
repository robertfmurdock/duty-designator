import React, {useState} from 'react';
import {Container, Typography} from "@material-ui/core";
import FetchService from "../utilities/services/fetchService";
import {loadStuff} from "../utilities/services/localStorageService";
import DutyHistoryTable from "./DutyHistoryTable";
import {parse, closestTo, format} from "date-fns";

export default function PioneerDutyHistory(props) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [pioneer, setPioneer] = useState(undefined);
    const [choreCounts, setChoreCounts] = useState([]);

    if (!dataLoaded) {
        setPioneerFromServer(props.id, pioneer, setPioneer);
        setPioneerFromLocalStorage(props.id, setPioneer, setChoreCounts);
        setDataLoaded(true); // will need to be moved to take async fetch into account
    }

    return <Container>
        <Typography variant="h4" className="history-header" align="center">Pioneer History</Typography>
        {conditionalRender(pioneer, choreCounts)}
    </Container>;
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

function generateInitialChoreCount(chore, date) {
    return Object.assign(chore, {count: 1, date});
}

const matchChoreById = choreId => choreCount => choreCount.id === choreId

const parseDate = date => parse(date, "MM/dd/yyyy", new Date())

const formattedMostRecentDate = (parsedChoreDate, parsedDutyDate) => {
    const mostRecentDate = closestTo(new Date(), [
        parsedChoreDate,
        parsedDutyDate
    ]);

    return format(mostRecentDate, "MM/dd/yyyy");
}

function mostRecentlyDone(countedChoreDate, dutyDate) {
    const parsedChoreDate = parseDate(countedChoreDate);
    const parsedDutyDate = parseDate(dutyDate);
    return formattedMostRecentDate(parsedChoreDate, parsedDutyDate);
}

function accumulateChoreCount(acc, duty) {
    const chore = duty.chore;
    const date = duty.date;

    const countedChore = acc.find(matchChoreById(chore.id));
    if (countedChore) {
        countedChore.count++;
        countedChore.date = mostRecentlyDone(countedChore.date, date);
    } else {
        acc.push(generateInitialChoreCount(chore, date));
    }
}

function countChoreFrequency(duties, pioneer) {
    return duties.reduce((acc, duty) => {
        if (duty.pioneer.id === pioneer.id) {
            accumulateChoreCount(acc, duty);
        }
        return acc;
    }, []);
}

const datedDuty = datedRoster => datedRoster.dutyRoster.map(duty =>
    Object.assign(duty, {date: datedRoster.date}));

function setPioneerFromLocalStorage(id, setPioneer, setChoreCounts) {
    let rosters = Object.keys(localStorage)
        .map(date => ({date, dutyRoster: loadStuff(date).dutyRoster}))
        .filter(datedRoster => datedRoster.dutyRoster !== false)
        .map(datedDuty);

    let duties = flattenList(rosters);
    const dutyWithMatchedPioneerId = duties.find(duty => duty.pioneer.id === id);

    if (dutyWithMatchedPioneerId) {
        const pioneer = dutyWithMatchedPioneerId.pioneer;
        let choresWithCounts = countChoreFrequency(duties, pioneer);
        choresWithCounts.sort((a, b) => a.count - b.count);
        setPioneer(pioneer);
        setChoreCounts(choresWithCounts);
    }
}

function setPioneerFromServer(id, currentPioneer, setPioneer) {
    FetchService.get(0, `/api/pioneer/${id}`)
        .then(pioneer => {
            if (!currentPioneer) {
                setPioneer(pioneer);
            }
        })
        .catch(err => console.warn("Problem fetching pioneer", err));
}