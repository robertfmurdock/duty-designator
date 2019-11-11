import React from "react";
import Card from "@material-ui/core/Card";

export default function OnClickCard (props) {
    const {clickEventHandler} = props;
    return <Card onClick={clickEventHandler}></Card>
}