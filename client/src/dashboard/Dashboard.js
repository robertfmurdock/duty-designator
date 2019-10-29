import React, {useState} from 'react';
import FetchService from '../utilities/services/fetchService';
import {Box, Button, Container} from '@material-ui/core';
import {AddChoreModal, ChoreTable, PioneerTable} from './index';

import {associateWithOffset} from "./Associator";
import {Loading} from "./Loading";
import DutyRoster from "../duties/DutyRoster";
import {loadStuff, saveStuff} from "../utilities/services/localStorageService";
import {format} from "date-fns";

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
        return dutyRosterPage(pioneers, chores, dutyRoster, setDutyRoster, setShowDutyRoster)
    } else {
        return choreCorralPage(
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

function loadState(setPioneers, setChores, setShowDutyRoster, setDutyRoster, setDataLoaded) {
    getData(setPioneers, setChores)
        .then(() => {
            const localBrowserState = loadStuff(today());
            if (localBrowserState !== undefined) {
                setShowDutyRoster(!!localBrowserState.dutyRoster);
                setDutyRoster(localBrowserState.dutyRoster);
            }
            return setDataLoaded(true);
        });
}

function getData(setPioneers, setChores) {
    return Promise.all([
        FetchService.get(0, "/api/pioneer", undefined),
        FetchService.get(0, "/api/chore", undefined)
    ])
        .then(results => {
            const [pioneers, chores] = results;
            setPioneers(pioneers);
            setChores(chores);
        })
}

function choreCorralPage(pioneers, setPioneers, chores, setChores, modalOpen, setModalOpen, setShowDutyRoster, setDataLoaded) {
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

const button = (id, text, onClick) => (
    <Button
        color="primary"
        size="large"
        variant="contained"
        id={id}
        onClick={onClick}>
        {text}
    </Button>
);

function resetButton(setDataLoaded) {
    return button("reset-button", "Reset", () => setDataLoaded(false));
}

function saddleUpButton(setShowDutyRoster) {
    return button("saddle-up", "Saddle Up", () => setShowDutyRoster(true));
}

function addChoreModal(modalOpen, setModalOpen, chores, setChores) {
    return <AddChoreModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onChoreAdd={(newChore) => addChore(newChore, chores, setModalOpen, setChores)}
    />;
}

const addChore = (newChore, chores, setModalOpen, setChores) => {
    const id = (chores.length + 1).toString();
    setModalOpen(false);
    setChores([...chores, {id, ...newChore}]);
};

const today = () => format(new Date(), 'MM/dd/yyyy');

function dutyRosterPage(pioneers, chores, dutyRoster, setDutyRoster, setShowDutyRoster) {
    return <DutyRoster
        pioneers={pioneers}
        chores={chores}
        dutyRoster={dutyRoster}
        onRespin={() => {
            setShowDutyRoster(false);
            setDutyRoster(false);
            saveStuff({
                dutyRoster: false
            }, today())
        }}
        onSave={(dutyRoster) => {
            setDutyRoster(dutyRoster);
            saveStuff({
                dutyRoster
            }, today())
        }}
            associator={associateFunction}
            />;
        }


