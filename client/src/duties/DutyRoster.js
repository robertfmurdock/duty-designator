import {Button, Container, Typography} from "@material-ui/core";
import React, {useState} from "react";
import DutyTable from "./DutyTable";
import {associateWithOffset} from "./Associator";
import {loadStuff, saveStuff} from "../utilities/services/localStorageService";
import {format} from "date-fns";

export default function DutyRoster(props) {
    const [canSave, setCanSave] = useState(true);
    const {pioneers, chores} = props;
    const [dutyRoster, setDutyRoster] = useState(false);

    if(!dutyRoster) {
        loadState(setCanSave, setDutyRoster, pioneers, chores);
    }

    return <Container>
        <DutyTable duties={dutyRoster}/>
        {respinButton(setCanSave, setDutyRoster, pioneers, chores)}
        {conditionalButtons(canSave, setCanSave, dutyRoster)}
    </Container>;
}

function loadState(setCanSave, setDutyRoster, pioneers, chores) {
    const localBrowserState = loadStuff(today(new Date()));
    if (localBrowserState !== undefined) {
        setCanSave(false);
        setDutyRoster(localBrowserState.dutyRoster);
        return;
    }

    setDutyRoster(associator(pioneers, chores));
    setCanSave(true);
}

const today = date => format(date, 'MM/dd/yyyy');

const associator = (pioneers, chores) => {
    return associateWithOffset(pioneers, chores, Date.now())
};

function conditionalButtons(canSave, setCanSave, dutyRoster) {
    return canSave
        ? saveButton(setCanSave, dutyRoster)
        : <Typography id='saved-confirmation' variant="body2" color='textPrimary'>
            Save Confirmed!
        </Typography>;
}

function respinButton(setCanSave, setDutyRoster, pioneers, chores) {
    return <Button
        color="secondary"
        size="large"
        variant="contained"
        id="respin"
        onClick={() => {
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