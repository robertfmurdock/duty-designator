import React from "react";
import Card from "@material-ui/core/Card";

export default function OnClickCard (props) {
    const {clickEventHandler} = props;
    return <Card className={'open-add-chore-modal-button'} onClick={clickEventHandler}>+</Card>
}