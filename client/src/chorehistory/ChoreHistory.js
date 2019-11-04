import React, {useEffect, useState} from 'react';
import {Typography} from "@material-ui/core";
import FetchService from "../utilities/services/fetchService";

export default function ChoreHistory(props) {
    const [pioneerId, setPioneerId] = useState(props.id)
    const [pioneer, setPioneer] = useState({});

    console.log("something")
    useEffect(() => {
        console.log("[[[[[Got here]]]]]]]")
        // FetchService.get(0, "/api/pioneerById", undefined)
        //     .then(pioneer => setPioneer(pioneer))
        //     .catch(() => {
        //         console.warn("Problem fetching pioneer");
        //     });
    });

    return <div>
        <Typography
            variant="body1"
            color='textPrimary'
            className="pioneer-name">
            {pioneer.name}
        </Typography>
    </div>;
}