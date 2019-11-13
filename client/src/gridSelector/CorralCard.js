import {Card, CardContent, Typography, IconButton, CardActions} from "@material-ui/core";
import React from "react";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";

export default function CorralCard({item, removable, onRemove}) {
    return <Card style={{height: "100%"}} className="corral-card" data-corral-id={item.id}>
        {whenRemovableIncludeRemoveButton(removable, onRemove)}
        <CardContent style={{textAlign: "center", padding: '0 16px 24px'}}>
            <Typography
                variant="body1"
                color="textPrimary"
                noWrap={false}
                style={{hyphens: 'auto', wordBreak: 'break-word'}}
            >
                {item.name}
            </Typography>
        </CardContent>
    </Card>;
};

function whenRemovableIncludeRemoveButton(removable, onRemove) {
    return removable
        ? <CardActions disableSpacing style={{padding: 0}}>
            <IconButton style={{marginLeft: 'auto'}}>
                <Icon className={'delete'} onClick={() => onRemove()}
                      path={mdiClose} style={{height: 20, width: 20}}
                />
            </IconButton>
        </CardActions>
        : undefined;
}
