import React from "react";
import GridSelector from "../pioneers/GridSelector";

export default function ChoreCorral (props) {
    return <div>
        <GridSelector chores={props.chores} pioneers={props.chores}/>
    </div>
}