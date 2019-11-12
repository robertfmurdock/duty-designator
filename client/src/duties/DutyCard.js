import React from "react";
import Card from "@material-ui/core/Card";
import {CardContent, CardHeader, Typography} from "@material-ui/core";

export default function DutyCard (props) {
    const {duty} = props;
    return <Card>
        <CardHeader title={duty.pioneer.name}/>
        <CardContent>
            <Typography className={"chore-title"} style={"h5"}>{duty.chore.title}</Typography>
            <Typography className={"chore-name"} style={"h6"}>{duty.chore.name}</Typography>
            <Typography className={"chore-description"} style={"body"}>{duty.chore.description}</Typography>
        </CardContent>
    </Card>;
}