import {Box, Button, Container} from "@material-ui/core";
import React, {useState} from "react";
import {AddChoreModal, ChoreTable, PioneerTable} from "../dashboard";
import FetchService from "../utilities/services/fetchService";
import {Link} from "react-router-dom";

export default function ChoreCorral(props) {
    const [pioneers, setPioneers] = useState(props.pioneers || []);
    const [chores, setChores] = useState(props.chores || []);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    if (dataLoaded === false) {
        handleDataLoad(props, setDataLoaded, setPioneers, setChores);
    }

    return <div>
        <Container>
            <Box display="flex" flexDirection="row" justifyContent="center">
                {pioneerTable(pioneers, setPioneers)}
                {choreTable(chores, setChores, setModalOpen)}
                {addChoreModal(modalOpen, setModalOpen, chores, setChores)}
            </Box>
            <Box>
                {resetButton(setPioneers, setChores, setDataLoaded)}
                {saddleUpButton(pioneers, chores)}
            </Box>
        </Container>
    </div>;
}

function handleDataLoad(props, setDataLoaded, setPioneers, setChores) {
    if (hasProvidedData(props)) {
        setDataLoaded(true);
    } else {
        startDataLoad(setPioneers, setChores, setDataLoaded);
    }
}

function hasProvidedData(props) {
    return !!props.pioneers && !!props.chores;
}

function startDataLoad(setPioneers, setChores, setDataLoaded) {
    getData(setPioneers, setChores)
        .then(results => {
            const [pioneers, chores] = results;
            setPioneers(pioneers);
            setChores(chores);
            setDataLoaded(true);
        });
}

function getData() {
    return Promise.all([
        FetchService.get(0, "/api/pioneer", undefined),
        FetchService.get(0, "/api/chore", undefined)
    ]);
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

function resetButton(setPioneers, setChores, setDataLoaded) {
    return button("reset-button", "Reset", () => startDataLoad(setPioneers, setChores, setDataLoaded));
}

function saddleUpButton(pioneers, chores) {
    return <Link
        id="saddle-up"
        to={{
            pathname: "/roster",
            state: {pioneers, chores}
        }}
        style={{textDecoration: "none"}}
    >
        <Button
            color="primary"
            size="large"
            variant="contained"
        >
            Saddle Up
        </Button>
    </Link>
}

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