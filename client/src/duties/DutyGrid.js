
import React, {useState} from "react";
import {Card, CardHeader} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CorralCard from "../gridSelector/CorralCard";
import DutyCard from "./DutyCard";


export default function DutyGrid(props) {
    let duties = props.duties;
    return <div>
        {duties.map(item => <Grid item height="" key={item.chore.id}>
                <DutyCard duty={item}/>
            </Grid>
        )}

    </div>
}
