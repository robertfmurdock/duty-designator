import {Box, Button, Container} from "@material-ui/core";
import React, {useState} from "react";
import {AddChoreModal, ChoreTable, PioneerTable} from "../dashboard";
import FetchService from "../utilities/services/fetchService";

export default function ChoreCorral(props) {
    const [pioneers, setPioneers] = useState([]);
    const [chores, setChores] = useState([]);
    const [showDutyRoster, setShowDutyRoster] = useState(false);
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
                {saddleUpButton(setShowDutyRoster)}
            </Box>
        </Container>
    </div>;
}

function fakeData() {
    return Promise.all([[
        {id: ' at thing', name: 'Friday Jeb'},
        {id: 'something else', name: 'Everyday Natalie'},
        {id: 'nothing', name: 'Odd Day Rob'}
    ], [
        {id: ' at thing', name: 'Chore 1'},
        {id: 'something else', name: 'Chore B'},
        {id: 'nothing', name: 'Chore 123'}
    ]]);
}

function getData() {
    // return fakeData()
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

function saddleUpButton(setShowDutyRoster) {
    return button("saddle-up", "Saddle Up", () => setShowDutyRoster(true));
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