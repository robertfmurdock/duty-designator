import React from "react";
import PioneerCard from "./PioneerCard";

export default function GridSelector(props) {
    const {pioneers, onRemove} = props;

    return <div>
        {pioneers.map(pioneer =>
            <PioneerCard {...{pioneer, key: pioneer.id, removable: true }}
                         onRemove={() => {onRemove(pioneer)}} />)}
    </div>
}