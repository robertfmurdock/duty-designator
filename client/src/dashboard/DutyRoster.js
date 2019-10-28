import {Button, Container} from "@material-ui/core";
import Results from "../results/Results";
import React from "react";

export default function DutyRoster(props) {
    const {pioneers, chores, dutyRoster, onRespin, onSave, associator} = props;
    return <Container>
        <Results pioneers={pioneers} chores={chores} associator={associator}/>
        {respinButton(onRespin)}
        {conditionallyRenderResultsButtons(dutyRoster, onSave)}
        {conditionallyRenderSavedConfirmation(dutyRoster)}
    </Container>;
}

function respinButton(onRespin) {
    return <Button
        color="secondary"
        size="large"
        variant="contained"
        id="respin"
        onClick={onRespin}>
        Respin this Wagon Wheel
    </Button>;
}

function conditionallyRenderResultsButtons(showSaveControls, onSave) {
    if (!showSaveControls) {
        return <div>
            {saveButton(onSave)}</div>;
    }
}

function saveButton(onSave) {
    return <Button
        color="primary"
        size="large"
        variant="contained"
        id="save"
        onClick={() => {onSave([])}}>
        Save this Wagon Wheel
    </Button>;
}

function conditionallyRenderSavedConfirmation(assignmentsSaved) {
    if (assignmentsSaved) {
        return <p id='saved-confirmation'>Save Confirmed!</p>
    }
}