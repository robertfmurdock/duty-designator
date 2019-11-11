import React from "react";
import PioneerCard from "./PioneerCard";
import OnClickCard from "../gridSelector/OnClickCard";

export default function GridSelector(props) {
    const {pioneers, onRemove, gridAddItemOnClick} = props;

    return <div>
        {pioneers.map(pioneer =>
            <PioneerCard {...{pioneer, key: pioneer.id, removable: true }}
                         onRemove={() => {onRemove(pioneer)}} />)}
            <OnClickCard clickEventHandler={gridAddItemOnClick}/>
    </div>
}