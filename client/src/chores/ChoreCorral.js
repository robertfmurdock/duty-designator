import React from "react";
import GridSelector from "../pioneers/GridSelector";

export default function ChoreCorral (props) {
    const {addChoreHandler} = props;

    return <div><div>Today's Chores</div>
        <GridSelector gridAddItemOnClick={addChoreHandler}
                      chores={props.chores}
                      pioneers={props.chores}/>
    </div>
}