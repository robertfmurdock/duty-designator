import React, {useState} from 'react';
import FetchService from '../utilities/services/fetchService';
import {Box, Button, Container} from '@material-ui/core';
import {AddChoreModal, ChoreTable, PioneerTable} from './index';
import Results from '../results/Results'
import associate from "../results/Associator";

const associateFunction = associate;

export default function Dashboard() {
    const [hasRendered, setHasRendered] = useState(false);
    const [pioneers, setPioneers] = useState([]);
    const [chores, setChores] = useState([]);
    const [hasBeenClicked, setHasBeenClicked] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [assignmentsSaved, setAssignmentsSaved] = useState(false);

    if (!hasRendered) {
        loadState(setPioneers, setChores, setHasBeenClicked, setModalOpen, setAssignmentsSaved);
        setHasRendered(true);
    }

    if (!hasBeenClicked) {
        return setupPage(
            pioneers,
            setPioneers,
            chores,
            setChores,
            modalOpen,
            setModalOpen,
            setHasBeenClicked
        );
    } else {
        const stuffSaver = () => saveStuff({
            pioneers,
            chores,
            hasBeenClicked,
            modalOpen,
            assignmentsSaved: true
        }, 'savedState');
        return resultsPage(pioneers, chores, setHasBeenClicked, assignmentsSaved, setAssignmentsSaved, stuffSaver)
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

function loadState(setPioneers, setChores, setHasBeenClicked, setModalOpen, setAssignmentsSaved) {
    const state = loadStuff('savedState');
    if (state === undefined) {
        populateTableState(setPioneers, setChores)
    } else {
        setPioneers(state.pioneers);
        setChores(state.chores);
        setHasBeenClicked(state.hasBeenClicked);
        setModalOpen(state.modalOpen);
        setAssignmentsSaved(state.assignmentsSaved);
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

function populateTableState(setPioneers, setChores) {
    FetchService.get(0, "/api/candidate", undefined)
        .then(response => setPioneers(response))
        .catch(err => console.warn(err));

    FetchService.get(0, "/api/chore", undefined)
        .then(response => setChores(response))
        .catch(err => console.warn(err));
}

function setupPage(pioneers, setPioneers, chores, setChores, modalOpen, setModalOpen, setHasBeenClicked) {
    return <div>
        <Container>
            <Box display="flex" flexDirection="row" justifyContent="center">
                {getPioneerTable(pioneers, setPioneers)}
                {getChoreTable(chores, setChores, setModalOpen)}
            </Box>
            <Box>
                {resetButton(setPioneers, setChores)}
                {saddleUpButton(setHasBeenClicked)}
                {addChoreModal(modalOpen, setModalOpen, chores, setChores)}
            </Box>
        </Container>
    </div>;
}

function getPioneerTable(pioneers, setPioneers) {
    return <PioneerTable
        pioneers={pioneers}
        onRemove={
            removedPioneer => setPioneers(
                pioneers.filter(pioneer => pioneer !== removedPioneer)
            )
        }
    />;
}

const getChoreTable = (chores, setChores, setModalOpen) => (
    <ChoreTable
        chores={chores}
        addChoreHandler={() => setModalOpen(true)}
        onRemove={removedChore => {
            setChores(chores.filter(
                chore => chore !== removedChore
            ))
        }}
    />
);

function resetButton(setPioneers, setChores) {
    return <Button
        color="primary"
        size="large"
        variant="contained"
        id="reset-button"
        onClick={() => populateTableState(setPioneers, setChores)}>
        Reset
    </Button>;
}

function saddleUpButton(setHasBeenClicked) {
    return <Button
        color="primary"
        size="large"
        variant="contained"
        id="saddle-up"
        onClick={() => setHasBeenClicked(true)}>
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

function resultsPage(pioneers, chores, setHasBeenClicked, assignmentsSaved, setAssignmentsSaved, saveStuff) {
    return <Container>
        <Results pioneers={pioneers} chores={chores} associator={associateFunction}/>
        {respinButton(setHasBeenClicked, setAssignmentsSaved)}
        {conditionallyRenderResultsButtons(assignmentsSaved, setAssignmentsSaved, saveStuff)}
        {conditionallyRenderSavedConfirmation(assignmentsSaved)}
    </Container>;
}

function respinButton(setHasBeenClicked, setAssignmentsSaved) {
    return <Button
        color="secondary"
        size="large"
        variant="contained"
        id="respin"
        onClick={() => {
            setHasBeenClicked(false);
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
