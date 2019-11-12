import React from "react";
import Grid from "@material-ui/core/Grid";
import DutyCard from "./DutyCard";


export default function DutyGrid(props) {
    const {duties} = props;
    return <Grid container spacing={2}>
        {duties.map(item => <Grid xs={2} item height="" key={item.chore.id}>
                <DutyCard duty={item}/>
            </Grid>
        )}
    </Grid>
}
