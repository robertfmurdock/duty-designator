import React from "react";
import PioneerGridSelector from "../pioneers/PioneerGridSelector";

export default function PioneerCorral (props) {
    const {pioneers, onRemove} = props;

    return <div> <div> TODAY'S PIONEERS </div>
        <PioneerGridSelector {...{pioneers, onRemove}}/>
    </div>
}