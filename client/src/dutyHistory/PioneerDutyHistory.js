import React, {useState} from 'react';
import {Container, Typography} from "@material-ui/core";
import FetchService from "../utilities/services/fetchService";
import DutyHistoryTable from "./DutyHistoryTable";
import {parse, closestTo, format} from "date-fns";

export default function PioneerDutyHistory(props) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [pioneer, setPioneer] = useState(undefined);
    const [choreCounts, setChoreCounts] = useState([]);

    if (!dataLoaded) {
        setPioneerFromServer(props.id, pioneer, setPioneer);
        calculations(props.id, props.rosterHistory, setPioneer, setChoreCounts);
        setDataLoaded(true);
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

const matchChoreById = choreId => choreCount => choreCount.id === choreId;

const parseDate = date => parse(date, "yyyy-MM-dd", new Date());

const formattedMostRecentDate = (parsedChoreDate, parsedDutyDate) => {
    const mostRecentDate = closestTo(new Date(), [
        parsedChoreDate,
        parsedDutyDate
    ]);

    return format(mostRecentDate, "yyyy-MM-dd");
};

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

const datedDuty = roster => {
    if(roster.duties === null) {
        return [];
    }
    return roster.duties.map(duty => Object.assign(duty, {date: roster.date}));
};

function calculations(id, rosters, setPioneer, setChoreCounts) {
    const datedDuties = rosters
        .map(datedDuty);

    let duties = flattenList(datedDuties);
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