import React from "react";
import Card from "@material-ui/core/Card";
import Icon from "@mdi/react";
import {mdiPlus} from "@mdi/js";

export default function OnClickCard (props) {
    const {clickEventHandler} = props;
    return <Card className={'open-add-chore-modal-button'} onClick={clickEventHandler}
                 style={{height: "100%", minWidth: 128, maxWidth: 128, textAlign: "center" }}>

        <Icon path={mdiPlus} style={{minWidth: "50%", maxWidth: "50%", margin: "12.5%"}}
        />
    </Card>
}