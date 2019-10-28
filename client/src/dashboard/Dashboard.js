import React, {useState} from 'react';
import FetchService from '../utilities/services/fetchService';
import {Box, Button, Container} from '@material-ui/core';
import {AddChoreModal, ChoreTable, PioneerTable} from './index';
import Results from '../results/Results'
import {associateWithOffset} from "../results/Associator";
import {Loading} from "./Loading";

const associateFunction = (pioneers, chores) => {
    return associateWithOffset(pioneers, chores, Date.now())
};

export default function Dashboard() {
    const [dataLoaded, setDataLoaded] = useState(undefined);
    const [pioneers, setPioneers] = useState([]);
    const [chores, setChores] = useState([]);
    const [showDutyRoster, setShowDutyRoster] = useState(false);
    const [assignmentsSaved, setAssignmentsSaved] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    if (!dataLoaded) {
        loadState(setPioneers, setChores, setShowDutyRoster, setAssignmentsSaved, setDataLoaded);
        return <Loading/>
    }
    if (showDutyRoster) {
        return resultsPage(pioneers, chores, setShowDutyRoster, assignmentsSaved, setAssignmentsSaved, showDutyRoster)
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

function loadState(setPioneers, setChores, setShowDutyRoster, setAssignmentsSaved, setDataLoaded) {
    const localBrowserState = loadStuff('savedState');
    if (localBrowserState !== undefined) {
        setPioneers(localBrowserState.pioneers);
        setChores(localBrowserState.chores);
        setShowDutyRoster(localBrowserState.showDutyRoster);
        setAssignmentsSaved(localBrowserState.assignmentsSaved);
        setDataLoaded(true);
    } else {
        getData(setPioneers, setChores)
            .then(() => setDataLoaded(true));
    }
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

function resultsPage(pioneers, chores, setShowDutyRoster, assignmentsSaved, setAssignmentsSaved, showDutyRoster) {
    const stuffSaver = () => saveStuff({
        pioneers,
        chores,
        showDutyRoster: showDutyRoster,
        assignmentsSaved: true
    }, 'savedState');

    return <Container>
        <Results pioneers={pioneers} chores={chores} associator={associateFunction}/>
        {respinButton(setShowDutyRoster, setAssignmentsSaved)}
        {conditionallyRenderResultsButtons(assignmentsSaved, setAssignmentsSaved, stuffSaver)}
        {conditionallyRenderSavedConfirmation(assignmentsSaved)}
    </Container>;
}

function respinButton(setShowDutyRoster, setAssignmentsSaved) {
    return <Button
        color="secondary"
        size="large"
        variant="contained"
        id="respin"
        onClick={() => {
            setShowDutyRoster(false);
            setAssignmentsSaved(false)
        }}>
        Respin this Wagon Wheel
    </Button>;
}

function conditionallyRenderResultsButtons(assignmentsSaved, setAssignmentsSaved, saveStuff) {
    if (!assignmentsSaved) {
        return <div>
            {saveButton(setAssignmentsSaved, saveStuff)}</div>;
    }
}

function saveButton(setAssignmentsSaved, saveStuff) {
    return <Button
        color="primary"
        size="large"
        variant="contained"
        id="save"
        onClick={() => {
            setAssignmentsSaved(true);
            saveStuff()
        }}>
        Save this Wagon Wheel
    </Button>;
}

function conditionallyRenderSavedConfirmation(assignmentsSaved) {
    if (assignmentsSaved) {
        return <p id='saved-confirmation'>Save Confirmed!</p>
    }
}
