import React from "react";
import GridSelector from "../gridSelector/GridSelector";

export default function ChoreCorral (props) {
    const {addChoreHandler, onRemove, chores} = props;

    return <div><h3>TODAY'S CHORES</h3>
        <GridSelector gridAddItemOnClick={addChoreHandler}
                      showGridAddItem={true}
                      items={chores}
                      onRemove={onRemove}/>
    </div>
}