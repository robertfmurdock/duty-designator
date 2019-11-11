import React from "react";
import CorralCard from "./CorralCard";
import OnClickCard from "./OnClickCard";

export default function GridSelector(props) {
    const {items, onRemove, gridAddItemOnClick} = props;

    return <div>
        {items.map(item =>
            <CorralCard {...{item, key: item.id, removable: true }}
                        onRemove={() => {onRemove(item)}} />)}
            <OnClickCard clickEventHandler={gridAddItemOnClick}/>
    </div>
}