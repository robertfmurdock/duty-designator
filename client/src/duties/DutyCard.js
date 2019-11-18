import React from "react";
import Card from "@material-ui/core/Card";
import {CardContent, CardHeader, Typography} from "@material-ui/core";

const workBreak = {hyphens: 'auto', wordBreak: 'break-word'}

export default function DutyCard(props) {
    const {duty} = props;
    return <Card className="duty" style={{height: "100%"}}>
        <CardHeader
            className="duty-pioneer-name"
            data-pioneer-id={duty.pioneer.id}
            style={workBreak}
            title={duty.pioneer.name}
            titleTypographyProps={{variant: "h4"}}
        />

        <CardContent style={{paddingTop: 0}}>
            <Typography
                className="duty-pioneer-title chore-title"
                variant="h5"
                data-chore-id={duty.chore.id}
                style={workBreak}
            >
                {duty.chore.title}
            </Typography>

            <Typography
                className="chore-name duty-chore-name"
                data-chore-id={duty.chore.id}
                variant="h6"
                style={workBreak}
            >
                {duty.chore.name}
            </Typography>
            <Typography
                className="chore-description"
                variant="body"
                style={workBreak}
            >
                {duty.chore.description}
            </Typography>
        </CardContent>
    </Card>;
}

