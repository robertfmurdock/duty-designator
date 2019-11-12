import React from "react";
import PioneerGridSelector from "../gridSelector/GridSelector";

export default function PioneerCorral (props) {
    const {pioneers: items, onRemove} = props;

    return <div> <h3> TODAY'S PIONEERS </h3>
        <PioneerGridSelector {...{items, onRemove}}/>
    </div>
}