import React from "react";
import GridSelector from "../gridSelector/GridSelector";

export default function ChoreCorral (props) {
    const {addChoreHandler, onRemove, chores} = props;

    return <div><div>Today's Chores</div>
        <GridSelector gridAddItemOnClick={addChoreHandler}
                      items={chores}
                      onRemove={onRemove}/>
    </div>
}