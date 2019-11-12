import {Container, Typography} from "@material-ui/core";
import React from "react";
import DutyTable from "./DutyTable";

export default function HistoricalRoster(props) {
    const {dutyRoster} = props;

    if (dutyRoster === null) {
        return <div style={{textAlign: "center"}}>
            <Typography variant="h5" color='textPrimary' gutterBottom>No chores were done today.</Typography>
        </div>
    }

    return <Container>
        <DutyTable duties={dutyRoster.duties}/>
    </Container>;
}
