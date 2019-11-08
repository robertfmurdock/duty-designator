import React from "react";
import PioneerGridSelector from "../pioneers/PioneerGridSelector";

export default function PioneerCorral (props) {
    const {pioneers} = props;

    return <div>
        <PioneerGridSelector {...{pioneers}}/>
    </div>
}