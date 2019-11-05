import React, {useState} from 'react';
import {Typography} from "@material-ui/core";
import FetchService from "../utilities/services/fetchService";
import {loadStuff} from "../utilities/services/localStorageService";

export default function ChoreHistory(props) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [pioneer, setPioneer] = useState(undefined);

    if (!dataLoaded) {
        setPioneerFromServer(props.id, setPioneer);

        const dutyWithMatchedPioneerId = findPioneerDutyInLocalStorage(props.id);
        if (dutyWithMatchedPioneerId) {
            setPioneer(dutyWithMatchedPioneerId.pioneer)
        }

        setDataLoaded(true);
    }

    return <div>
        <Typography variant="h1" className="history-header">Pioneer History</Typography>
        {conditionalRender(pioneer)}
    </div>;
}

const conditionalRender = pioneer => (
    pioneer
        ? <Typography
            variant="body1"
            color="textPrimary"
            className="pioneer-name"
        >
            {pioneer.name}
        </Typography>
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

function findPioneerDutyInLocalStorage(id) {
    let rosters = Object.keys(localStorage)
        .map(date => loadStuff(date).dutyRoster)
        .filter(roster => roster !== false);

    return flattenList(rosters)
        .find(duty => duty.pioneer.id === id);
}

function setPioneerFromServer(id, setPioneer) {
    FetchService.post(0, "/api/pioneerById", {id}, undefined)
        .then(pioneer => setPioneer(pioneer))
        .catch(err => console.warn("Problem fetching pioneer", err));
}