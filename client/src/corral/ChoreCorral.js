import {Box, Button, Container} from "@material-ui/core";
import React, {useState} from "react";
import {AddChoreModal, ChoreTable, PioneerTable} from "../dashboard";
import FetchService from "../utilities/services/fetchService";
import {Link} from "react-router-dom";

export default function ChoreCorral() {
    const [pioneers, setPioneers] = useState([]);
    const [chores, setChores] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    if (!dataLoaded) {
        getData(setPioneers, setChores)
            .then(results => {
                const [pioneers, chores] = results;
                setPioneers(pioneers);
                setChores(chores);
                setDataLoaded(true);
            });
    }

    return <div>
        <Container>
            <Box display="flex" flexDirection="row" justifyContent="center">
                {pioneerTable(pioneers, setPioneers)}
                {choreTable(chores, setChores, setModalOpen)}
                {addChoreModal(modalOpen, setModalOpen, chores, setChores)}
            </Box>
            <Box>
                {resetButton(setDataLoaded)}
                {saddleUpButton(pioneers, chores)}
            </Box>
        </Container>
    </div>;
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

function resetButton(setDataLoaded) {
    return button("reset-button", "Reset", () => setDataLoaded(false));
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