import {Button, Container, Typography} from "@material-ui/core";
import React, {useState} from "react";
import DutyTable from "./DutyTable";
import {associateWithOffset} from "./Associator";
import {loadStuff, saveStuff} from "../utilities/services/localStorageService";
import {format} from "date-fns";

export default function DutyRoster(props) {
    const [canSave, setCanSave] = useState(true);
    const [pioneers, setPioneers] = useState(props.pioneers || []);
    const [chores, setChores] = useState(props.chores || []);
    const [dutyRoster, setDutyRoster] = useState(false);
    const history = props.history;

    if (!dutyRoster) {
        loadState(setCanSave, setDutyRoster, pioneers, chores, setPioneers, setChores, props);
    }

    return <Container maxWidth={"xl"}>
        <DutyTable duties={dutyRoster}/>
        {respinButton(history)}
        {conditionalButtons(canSave, setCanSave, dutyRoster, history)}
    </Container>;
}

const associator = (pioneers, chores) => {
    return associateWithOffset(pioneers, chores, Date.now())
};

function conditionalButtons(canSave, setCanSave, dutyRoster, history) {
    return canSave
        ? saveButton(setCanSave, dutyRoster, history)
        : <Typography id='saved-confirmation' variant="body2" color='textPrimary'>
            Save Confirmed!
        </Typography>;
}

function respinButton(history) {
    return <Button
        color="secondary"
        size="large"
        variant="contained"
        id="respin"
        onClick={()=> history.push('/corral')}
    >
        Respin this Wagon Wheel
    </Button>
}

function saveButton(setCanSave, dutyRoster, history) {
    return <Button
        color="primary"
        size="large"
        variant="contained"
        id="save"
        onClick={() => {
            saveWithDate(dutyRoster);
            setCanSave(false);
            history.push('/roster')
        }}>
        Save this Wagon Wheel
    </Button>;
}

function saveWithDate(dutyRoster) {
    const date = format(new Date(), 'MM/dd/yyyy');
    saveStuff({dutyRoster}, date);
}

function determineWhetherShouldAllowSave(props, setCanSave) {
    if (!!props.pioneers && !!props.chores) {
        setCanSave(true);
    } else {
        setCanSave(false);
    }
}

function loadState(setCanSave, setDutyRoster, pioneers, chores, setPioneers, setChores, props) {
    const localBrowserState = loadStuff(today(new Date()));
    if (localBrowserState !== undefined) {
        determineWhetherShouldAllowSave(props, setCanSave);

        const roster = localBrowserState.dutyRoster;
        setDutyRoster(roster);
        setPioneers(roster.map(duty => duty.pioneer));
        setChores(roster.map(duty => duty.chore));
        return;
    }

    setDutyRoster(associator(pioneers, chores));
    setCanSave(true);
}

const today = date => format(date, 'MM/dd/yyyy');