import React from "react";
import PioneerGridSelector from "../gridSelector/GridSelector";

export default function PioneerCorral (props) {
    const {pioneers: items, onRemove} = props;

    return <div> <div> TODAY'S PIONEERS </div>
        <PioneerGridSelector {...{items, onRemove}}/>
    </div>
}