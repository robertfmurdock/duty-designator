import React from "react";
import PioneerGridSelector from "./GridSelector";

export default function PioneerCorral (props) {
    const {pioneers, onRemove} = props;

    return <div> <div> TODAY'S PIONEERS </div>
        <PioneerGridSelector {...{pioneers, onRemove}}/>
    </div>
}