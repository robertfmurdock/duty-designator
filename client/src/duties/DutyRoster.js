import {Button, Container} from "@material-ui/core";
import React from "react";
import DutyTable from "./DutyTable";

export default function DutyRoster(props) {
    const {pioneers, chores, onRespin, onSave, associator} = props;
    let {dutyRoster} = props;
    let canSave = !dutyRoster;
    if(!dutyRoster){
        dutyRoster = associator(pioneers, chores);
    }
    return <Container>
        <Container className="results">
            <DutyTable duties={dutyRoster}/>
        </Container>
        {respinButton(onRespin)}
        {conditionallyRenderResultsButtons(canSave, dutyRoster, onSave)}
        {conditionallyRenderSavedConfirmation(canSave)}
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

function conditionallyRenderResultsButtons(canSave, dutyRoster, onSave) {
    if (canSave) {
        return <div>
            {saveButton(onSave, dutyRoster)}</div>;
    }
}

function saveButton(onSave, dutyRoster) {
    return <Button
        color="primary"
        size="large"
        variant="contained"
        id="save"
        onClick={() => {onSave(dutyRoster)}}>
        Save this Wagon Wheel
    </Button>;
}

function conditionallyRenderSavedConfirmation(canSave) {
    if (!canSave) {
        return <p id='saved-confirmation'>Save Confirmed!</p>
    }
}