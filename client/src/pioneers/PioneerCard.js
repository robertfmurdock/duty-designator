import {Card, CardContent, Typography} from "@material-ui/core";
import React from "react";

export default function PioneerCard({pioneer}) {
    return <Card style={{height: "100%"}}>
        <CardContent>
            <Typography
                variant="body1"
                color="textPrimary"
                className="pioneer-name"
            >
                {pioneer.name}
            </Typography>
        </CardContent>
    </Card>;
}