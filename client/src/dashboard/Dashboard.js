import React, {useState} from 'react';
import FetchService from '../utilities/services/fetchService';
import {Box, Button, Container, Typography} from '@material-ui/core';
import {AddChoreModal, ChoreTable, PioneerTable} from './index';
import Results from '../results/Results'
import {associateWithOffset} from "../results/Associator";

const associateFunction = (pioneers, chores) => {
    return associateWithOffset(pioneers, chores, Date.now())
};

export default function Dashboard() {
    const [hasRendered, setDataLoaded] = useState(false);
    const [pioneers, setPioneers] = useState([]);
    const [chores, setChores] = useState([]);
    const [hasBeenClicked, setHasBeenClicked] = useState(false);
    const [assignmentsSaved, setAssignmentsSaved] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    if (!hasRendered) {
        loadState(setPioneers, setChores, setHasBeenClicked, setAssignmentsSaved, setDataLoaded);
        return <Typography>Loadin', pardners</Typography>
    }
    if (hasBeenClicked) {
        return resultsPage(pioneers, chores, setHasBeenClicked, assignmentsSaved, setAssignmentsSaved, hasBeenClicked)
    } else {
        return setupPage(
            pioneers,
            setPioneers,
            chores,
            setChores,
            modalOpen,
            setModalOpen,
            setHasBeenClicked,
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

function loadState(setPioneers, setChores, setHasBeenClicked, setAssignmentsSaved, setDataLoaded) {
    const state = loadStuff('savedState');
    if (state === undefined) {
        populateTableState(setPioneers, setChores, setDataLoaded)
    } else {
        setPioneers(state.pioneers);
        setChores(state.chores);
        setHasBeenClicked(state.hasBeenClicked);
        setAssignmentsSaved(state.assignmentsSaved);
        setDataLoaded(true);
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

function populateTableState(setPioneers, setChores, setDataLoaded) {
    Promise.all([
        FetchService.get(0, "/api/candidate", undefined),
        FetchService.get(0, "/api/chore", undefined)
    ])
        .then(results => {
            const [pioneers, chores] = results;
            setPioneers(pioneers);
            setChores(chores);
            setDataLoaded(true);
        })
}

function setupPage(pioneers, setPioneers, chores, setChores, modalOpen, setModalOpen, setHasBeenClicked, setDataLoaded) {
    return <div>
        <Container>
            <Box display="flex" flexDirection="row" justifyContent="center">
                {getPioneerTable(pioneers, setPioneers)}
                {getChoreTable(chores, setChores, setModalOpen)}
            </Box>
            <Box>
                {resetButton(setDataLoaded)}
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

function resultsPage(pioneers, chores, setHasBeenClicked, assignmentsSaved, setAssignmentsSaved, hasBeenClicked) {
    const stuffSaver = () => saveStuff({
        pioneers,
        chores,
        hasBeenClicked,
        assignmentsSaved: true
    }, 'savedState');

    return <Container>
        <Results pioneers={pioneers} chores={chores} associator={associateFunction}/>
        {respinButton(setHasBeenClicked, setAssignmentsSaved)}
        {conditionallyRenderResultsButtons(assignmentsSaved, setAssignmentsSaved, stuffSaver)}
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
