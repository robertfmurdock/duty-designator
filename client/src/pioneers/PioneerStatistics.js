import React, {useState} from "react";
import FetchService from "../utilities/services/fetchService";
import {Container, Grid, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import CorralCard from "../gridSelector/CorralCard";

export default function PioneerStatistics() {
    const [pioneers, setPioneers] = useState([]);
    const [fetchDone, setFetchDone] = useState(false);

    if (!fetchDone) {
        setFetchDone(true);
        FetchService.get(0, "/api/pioneer")
            .then(fetchedPioneers => {
                const sortedPioneers = alphabetize(fetchedPioneers);
                setPioneers(sortedPioneers);
            })
            .catch(err => console.warn(err));
    }

    return <Container>
        <Typography variant="h4" color="textPrimary" gutterBottom>Pioneers</Typography>
        <Grid container spacing={2} wrap="wrap">
            {pioneers.map(pioneerCard)}
        </Grid>
    </Container>
}

const alphabetize = pioneers =>
    pioneers.sort((a, b) => a.name > b.name ? 1 : -1);

const linkStyle = {textDecoration: "none", display: "block", height: "100%"};

const pioneerCard = pioneer => {
    return <Grid item xs={6} sm={3} height="" key={pioneer.id}>
        <Link
            to={`/pioneer/${pioneer.id}/history`}
            className="pioneer-link"
            style={linkStyle}
            data-pioneer-id={pioneer.id}
        >
            <CorralCard item={pioneer}/>
        </Link>
    </Grid>
};