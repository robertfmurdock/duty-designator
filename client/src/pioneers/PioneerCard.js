import {Card, CardContent, Typography} from "@material-ui/core";
import React from "react";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";

export default function PioneerCard({pioneer, removable, onRemove}) {
    return <Card style={{height: "100%"}}>
        <CardContent>
            <Typography
                variant="body1"
                color="textPrimary"
                className="pioneer-name"
            >
                {pioneer.name}
            </Typography>
            {whenRemovableIncludeRemoveButton(removable, onRemove)}
        </CardContent>
    </Card>;
};

function whenRemovableIncludeRemoveButton(removable, onRemove) {
    return removable ?
        <Icon path={mdiClose} className={'delete'} onClick={() => onRemove()}/>
        : undefined;
}
