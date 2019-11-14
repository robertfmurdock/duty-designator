import {Box, Button, Container} from "@material-ui/core";
import React, {useState} from "react";
import {AddChoreModal} from "../dashboard";
import {format} from "date-fns";
import PioneerCorral from "../pioneers/PioneerCorral";
import ChoreCorral from "../chores/ChoreCorral";
import TodaysWagonWheel from "../dashboard/wheel/TodaysWagonWheel";
import FetchService from "../utilities/services/fetchService";

export default function Corral(props) {
    const [pioneers, setPioneers] = useState(props.pioneers || []);
    const [chores, setChores] = useState(props.chores || []);
    const [modalOpen, setModalOpen] = useState(false);
    const {history} = props;

    return <div>
        <Container style={{maxWidth: 1600}}>
            <TodaysWagonWheel date={new Date()}/>
            {pioneerCorral(pioneers, setPioneers)}
            <br/>
            {choreCorral(chores, setChores, setModalOpen)}
            <br/>
            {resetButton(setPioneers, setChores)}
            {saddleUpButton(pioneers, chores, history)}
            {addChoreModal(modalOpen, setModalOpen, chores, setChores)}
            <br/>
            <Box>

            </Box>
        </Container>
    </div>;
}

function pioneerCorral(pioneers, setPioneers) {
    return <PioneerCorral
        pioneers={pioneers}
        onRemove={
            removedPioneer => setPioneers(
                pioneers.filter(pioneer => pioneer !== removedPioneer)
            )
        }
    />;
}

const choreCorral = (chores, setChores, setModalOpen) => (
    <ChoreCorral
        chores={chores}
        addChoreHandler={() => setModalOpen(true)}
        onRemove={removedChore =>
            setChores(chores.filter(
                chore => chore !== removedChore
            ))}
    />
);

function resetButton(setPioneers, setChores) {
    return button("reset-button", "Reset", () => startDataLoad(setPioneers, setChores));
}

function startDataLoad(setPioneers, setChores) {
    getData(setPioneers, setChores)
        .then(results => {
            const [pioneers, chores] = results;
            setPioneers(pioneers);
            setChores(chores);
        });
}

function getData() {
    return Promise.all([
        FetchService.get(0, "/api/pioneer", undefined),
        FetchService.get(0, "/api/chore", undefined)
    ]);
}
async function putCorral(today, pioneers, chores, history) {
    await fetch(`/api/corral/${today}`, {
        method: "PUT",
        body: JSON.stringify({pioneers, chores, date: today}),
        signal: undefined
    });
    history.push('/roster?spin=true')
}

function saddleUpButton(pioneers, chores, history) {
    return <Button
        id="saddle-up"
        color="primary"
        size="large"
        variant="contained"
        onClick={() => {
            const apiDateFormat = 'yyyy-MM-dd';
            const today = format(new Date(), apiDateFormat);
            putCorral(today, pioneers, chores, history).catch(err => console.error(err));
        }}
    >
        Saddle Up
    </Button>
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