import React, {useState} from 'react';
import {Typography} from "@material-ui/core";
import FetchService from "../utilities/services/fetchService";
import {loadStuff} from "../utilities/services/localStorageService";

function flattenList(themRosters) {
    return [].concat.apply([], themRosters);
}

export default function ChoreHistory(props) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [pioneer, setPioneer] = useState(undefined);

    if (!dataLoaded) {
        FetchService.post(0, "/api/pioneerById", {id: props.id}, undefined)
            .then(pioneer => {
                setPioneer(pioneer);
            })
            .catch(err => {
                console.warn("Problem fetching pioneer", err);
            });

        let rosters = Object.keys(localStorage)
            .map(key => loadStuff(key).dutyRoster)
            .filter(roster => roster !== false);

        let duty = flattenList(rosters).find(duty => {
            return duty.pioneer.id === props.id;
        });

        if (duty) {
            setPioneer(duty.pioneer)
        }

        setDataLoaded(true);
    }

    return <div>
        <Typography variant={"h1"} className={"history-header"}>Pioneer History</Typography>
        {pioneer &&
        <Typography
            variant="body1"
            color='textPrimary'
            className="pioneer-name">
            {pioneer.name}
        </Typography>
        }
    </div>;
}