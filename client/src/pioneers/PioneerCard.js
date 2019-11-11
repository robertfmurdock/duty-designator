import {Card, CardContent, Typography} from "@material-ui/core";
import React from "react";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";

export default function PioneerCard({pioneer, removable, onRemove}) {
    return <Card style={{height: "100%"}} className="pioneer-card" data-pioneer-id={pioneer.id} >
        <CardContent>
            <Typography
                variant="body1"
                color="textPrimary"

            >
                {pioneer.name}
            </Typography>
            {whenRemovableIncludeRemoveButton(removable, onRemove, pioneer.id)}
        </CardContent>
    </Card>;
};

function whenRemovableIncludeRemoveButton(removable, onRemove, dataPioneerId) {
    return removable ?
        <Icon path={mdiClose} data-pioneer-id={dataPioneerId} className={'delete'} onClick={() => onRemove()}/>
        : undefined;
}
