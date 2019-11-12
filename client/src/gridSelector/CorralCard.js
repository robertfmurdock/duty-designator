import {Card, CardContent, Typography} from "@material-ui/core";
import React from "react";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";
import Box from "@material-ui/core/Box";

export default function CorralCard({item, removable, onRemove}) {
    return <Card style={{height: "100%", minWidth: 128, maxWidth: 128}} className="corral-card" data-corral-id={item.id}>
        <CardContent
            style={{textAlign: "center"}}
        ><Box style={{textAlign: "right", display: "block"}}>{whenRemovableIncludeRemoveButton(removable, onRemove)}</Box>
            <Typography
                variant="body1"
                color="textPrimary"
                noWrap={false}
                style={{marginTop: "12.5%", margin: 0}}
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
