import {Button, Container} from "@material-ui/core";
import React, {useState} from "react";
import DutyTable from "./DutyTable";
import {associateWithOffset} from "./Associator";
import {saveStuff} from "../utilities/services/localStorageService";
import {format} from "date-fns";

export default function DutyRoster(props) {
    const [canSave, setCanSave] = useState(true);
    const {pioneers, chores} = props;

    let roster = associator(pioneers, chores);
    const [dutyRoster, setDutyRoster] = useState(roster);

    return <Container>
        <DutyTable duties={dutyRoster}/>
        {respinButton(setCanSave, setDutyRoster, pioneers, chores)}
        {conditionalButtons(canSave, setCanSave, dutyRoster)}
    </Container>;
}

const associator = (pioneers, chores) => {
    return associateWithOffset(pioneers, chores, Date.now())
};

function conditionalButtons(canSave, setCanSave, dutyRoster) {
    return canSave
        ? saveButton(setCanSave, dutyRoster)
        : <p id='saved-confirmation'>Save Confirmed!</p>;
}

function respinButton(setCanSave, setDutyRoster, pioneers, chores) {
    return <Button
        color="secondary"
        size="large"
        variant="contained"
        id="respin"
        onClick={() => {
            saveWithDate(false);
            setCanSave(true);
            setDutyRoster(associator(pioneers, chores));
        }}>
        Respin this Wagon Wheel
    </Button>;
}

function saveButton(setCanSave, dutyRoster) {
    return <Button
        color="primary"
        size="large"
        variant="contained"
        id="save"
        onClick={() => {
            saveWithDate(dutyRoster);
            setCanSave(false);
        }}>
        Save this Wagon Wheel
    </Button>;
}

function saveWithDate(dutyRoster) {
    const date = format(new Date(), 'MM/dd/yyyy');
    saveStuff({dutyRoster}, date);
}