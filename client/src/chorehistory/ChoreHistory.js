import React, {useState} from 'react';
import {Typography} from "@material-ui/core";
import FetchService from "../utilities/services/fetchService";

export default function ChoreHistory(props) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [pioneer, setPioneer] = useState({});

    if (!dataLoaded) {
        FetchService.post(0, "/api/pioneerById", {id: props.id},undefined)
            .then(pioneer => {
                setPioneer(pioneer);
                setDataLoaded(true);
            })
            .catch(err => {
                console.warn("Problem fetching pioneer", err);
            });
    }

    return <div>
        <Typography
            variant="body1"
            color='textPrimary'
            className="pioneer-name">
            {pioneer.name}
        </Typography>
    </div>;
}