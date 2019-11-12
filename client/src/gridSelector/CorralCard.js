import {Card, CardContent, Typography} from "@material-ui/core";
import React from "react";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";
import CardActions from "@material-ui/core/CardActions";

export default function CorralCard({item, removable, onRemove}) {
    return <Card style={{height: "100%"}} className="corral-card" data-corral-id={item.id}>
        <CardActions style={{textAlign: "right", display: "block"}}>{whenRemovableIncludeRemoveButton(removable, onRemove)}</CardActions>
        <CardContent>
            <Typography
                variant="body1"
                color="textPrimary"
            >
                {item.name}
            </Typography>
        </CardContent>
    </Card>;
};

function whenRemovableIncludeRemoveButton(removable, onRemove) {
    return removable ?
        <Icon className={'delete'} onClick={() => onRemove()}
              path={mdiClose} style={{height: 20, width: 20}}
        />
            : undefined;
}