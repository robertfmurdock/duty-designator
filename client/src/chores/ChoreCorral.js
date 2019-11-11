import React from "react";
import GridSelector from "../pioneers/GridSelector";

export default function ChoreCorral (props) {
    const {addChoreHandler, onRemove, chores} = props;

    return <div><div>Today's Chores</div>
        <GridSelector gridAddItemOnClick={addChoreHandler}
                      chores={chores}
                      pioneers={chores}
                      onRemove={onRemove}/>
    </div>
}