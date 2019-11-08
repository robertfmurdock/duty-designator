import React from "react";
import PioneerCard from "./PioneerCard";

export default function PioneerGridSelector(props) {
    return <div>
        {props.pioneers.map(pioneer => <PioneerCard {...{pioneer, key: pioneer.id}} />)}
    </div>
}