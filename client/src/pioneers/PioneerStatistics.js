import React, {useState} from "react";
import FetchService from "../utilities/services/fetchService";
import {Container, Typography, Grid, Card, CardContent} from "@material-ui/core";
import {Link} from "react-router-dom";

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
        <Grid container spacing={2}>
            {pioneers.map(pioneerCard)}
        </Grid>
    </Container>
}

const alphabetize = pioneers =>
    pioneers.sort((a, b) => a.name > b.name ? 1 : -1);

const pioneerCard = pioneer => {
    return <Grid item xs={3} key={pioneer.id}>
        <Link
            to={`/pioneer/${pioneer.id}/history`}
            className="pioneer-link"
            style={{textDecoration: "none", display: "block"}}
            data-pioneer-id={pioneer.id}
        >
            <Card>
                <CardContent>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                        className="pioneer-name"
                    >
                        {pioneer.name}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    </Grid>
};