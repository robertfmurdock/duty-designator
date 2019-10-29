import React, {useState} from 'react';
import FetchService from '../utilities/services/fetchService';
import {Box, Button, Container} from '@material-ui/core';
import {AddChoreModal, ChoreTable, PioneerTable} from './index';

import {associateWithOffset} from "./Associator";
import {Loading} from "./Loading";
import DutyRoster from "../duties/DutyRoster";

const associateFunction = (pioneers, chores) => {
    return associateWithOffset(pioneers, chores, Date.now())
};

export default function Dashboard() {
    const [dataLoaded, setDataLoaded] = useState(undefined);
    const [pioneers, setPioneers] = useState([]);
    const [chores, setChores] = useState([]);
    const [showDutyRoster, setShowDutyRoster] = useState(false);
    const [dutyRoster, setDutyRoster] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    if (!dataLoaded) {
        loadState(setPioneers, setChores, setShowDutyRoster, setDutyRoster, setDataLoaded);
        return <Loading/>
    }
    if (showDutyRoster) {
        return resultsPage(pioneers, chores, dutyRoster, setDutyRoster, showDutyRoster, setShowDutyRoster)
    } else {
        return setupPage(
            pioneers,
            setPioneers,
            chores,
            setChores,
            modalOpen,
            setModalOpen,
            setShowDutyRoster,
            setDataLoaded
        );
    }
}

const saveStuff = (stuff, key) => {
    try {
        const serializedState = JSON.stringify(stuff);
        localStorage.setItem(key, serializedState);
    } catch (err) {
        console.log(err)
    }
};

function loadState(setPioneers, setChores, setShowDutyRoster, setDutyRoster, setDataLoaded) {

    getData(setPioneers, setChores)
        .then(() => {
            const localBrowserState = loadStuff('savedState');
            if (localBrowserState !== undefined) {
                setShowDutyRoster(!!localBrowserState.dutyRoster);
                setDutyRoster(localBrowserState.dutyRoster);
            }
            return setDataLoaded(true);
        });
}

const loadStuff = (key) => {
    try {
        const serializedState = localStorage.getItem(key);
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (err) {
        return undefined;
    }
};

function getData(setPioneers, setChores) {
    return Promise.all([
        FetchService.get(0, "/api/candidate", undefined),
        FetchService.get(0, "/api/chore", undefined)
    ])
        .then(results => {
            const [pioneers, chores] = results;
            setPioneers(pioneers);
            setChores(chores);
        })
}

function setupPage(pioneers, setPioneers, chores, setChores, modalOpen, setModalOpen, setShowDutyRoster, setDataLoaded) {
    return <div>
        <Container>
            <Box display="flex" flexDirection="row" justifyContent="center">
                {pioneerTable(pioneers, setPioneers)}
                {choreTable(chores, setChores, setModalOpen)}
                {addChoreModal(modalOpen, setModalOpen, chores, setChores)}
            </Box>
            <Box>
                {resetButton(setDataLoaded)}
                {saddleUpButton(setShowDutyRoster)}
            </Box>
        </Container>
    </div>;
}

function pioneerTable(pioneers, setPioneers) {
    return <PioneerTable
        pioneers={pioneers}
        onRemove={
            removedPioneer => setPioneers(
                pioneers.filter(pioneer => pioneer !== removedPioneer)
            )
        }
    />;
}

const choreTable = (chores, setChores, setModalOpen) => (
    <ChoreTable
        chores={chores}
        addChoreHandler={() => setModalOpen(true)}
        onRemove={removedChore =>
            setChores(chores.filter(
                chore => chore !== removedChore
            ))}
    />
);

function resetButton(setDataLoaded) {
    return <Button
        color="primary"
        size="large"
        variant="contained"
        id="reset-button"
        onClick={() => setDataLoaded(false)}>
        Reset
    </Button>;
}

function saddleUpButton(setShowDutyRoster) {
    return <Button
        color="primary"
        size="large"
        variant="contained"
        id="saddle-up"
        onClick={() => setShowDutyRoster(true)}>
        Saddle Up
    </Button>;
}

function addChoreModal(modalOpen, setModalOpen, chores, setChores) {
    return <AddChoreModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        addChore={(name, description) => addChore(name, description, chores, setModalOpen, setChores)}
    />;
}

const addChore = (name, description, chores, setModalOpen, setChores) => {
    const id = (chores.length + 1).toString();
    const newChore = {id, name, description};
    setModalOpen(false);
    setChores([...chores, newChore]);
};

function resultsPage(pioneers, chores, dutyRoster, setDutyRoster, showDutyRoster, setShowDutyRoster) {
    return <DutyRoster
        pioneers={pioneers}
        chores={chores}
        dutyRoster={dutyRoster}
        onRespin={() => {
            setShowDutyRoster(false);
            setDutyRoster(false);
            saveStuff({
                dutyRoster: false
            }, 'savedState')
        }}
        onSave={(dutyRoster) => {
            setDutyRoster(dutyRoster);
            saveStuff({
                dutyRoster: dutyRoster
            }, 'savedState')
        }}
        associator={associateFunction}
    />;
}


