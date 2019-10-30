import React, {useState, useEffect} from 'react';
import FetchService from '../utilities/services/fetchService';

import {associateWithOffset} from "./Associator";
import {Loading} from "./Loading";
import DutyRoster from "../duties/DutyRoster";
import {loadStuff, saveStuff} from "../utilities/services/localStorageService";
import {format} from "date-fns";
import ChoreCorral from "../corral/ChoreCorral";

const associateFunction = (pioneers, chores) => {
    return associateWithOffset(pioneers, chores, Date.now())
};

export default function Dashboard(props) {
    const [dataLoaded, setDataLoaded] = useState(undefined);
    const [pioneers, setPioneers] = useState([]);
    const [chores, setChores] = useState([]);
    const [showDutyRoster, setShowDutyRoster] = useState(false);
    const [dutyRoster, setDutyRoster] = useState(false);

    const [date, setDate] = useState(props.date);

    // useEffect(() => {
    //     setDate(props.date);
    //     setDataLoaded(false);
    //     setDutyRoster(false);
    //     setShowDutyRoster(false);
    // }, [props.date]);

    if (!dataLoaded) {
        loadState(setPioneers, setChores, setShowDutyRoster, setDutyRoster, setDataLoaded, date);
        return <Loading/>
    }

    if (showDutyRoster) {
        return dutyRosterPage(pioneers, chores, dutyRoster, setDutyRoster, setShowDutyRoster, date)
    } else {
        return <ChoreCorral
        pioneers={pioneers}
        chores={chores}
        setShowDutyRoster={setShowDutyRoster}
        setDataLoaded={setDataLoaded}/>
    }
}

function loadState(setPioneers, setChores, setShowDutyRoster, setDutyRoster, setDataLoaded, date) {
    getData(setPioneers, setChores)
        .then(() => {
            const localBrowserState = loadStuff(today(date));
            if (localBrowserState !== undefined) {
                setShowDutyRoster(!!localBrowserState.dutyRoster);
                setDutyRoster(localBrowserState.dutyRoster);
            }
            return setDataLoaded(true);
        });
}

function fakeData(setPioneers, setChores) {
    return Promise.all([[
        {id: ' at thing', name: 'Friday Jeb'},
        {id: 'something else', name: 'Everyday Natalie'},
        {id: 'nothing', name: 'Odd Day Rob'}
    ], [
        {id: ' at thing', name: 'Chore 1'},
        {id: 'something else', name: 'Chore B'},
        {id: 'nothing', name: 'Chore 123'}
    ]]).then(results => {
        const [pioneers, chores] = results;
        setPioneers(pioneers);
        setChores(chores);
    });
}

function getData(setPioneers, setChores) {
    // return fakeData(setPioneers, setChores);
    return Promise.all([
        FetchService.get(0, "/api/pioneer", undefined),
        FetchService.get(0, "/api/chore", undefined)
    ])
        .then(results => {
            const [pioneers, chores] = results;
            setPioneers(pioneers);
            setChores(chores);
        });
}

const today = date => format(date, 'MM/dd/yyyy');

function dutyRosterPage(pioneers, chores, dutyRoster, setDutyRoster, setShowDutyRoster, date) {
    return <DutyRoster
        pioneers={pioneers}
        chores={chores}
        dutyRoster={dutyRoster}
        onRespin={() => {
            setShowDutyRoster(false);
            setDutyRoster(false);
            saveStuff({
                dutyRoster: false
            }, today(date))
        }}
        onSave={(dutyRoster) => {
            setDutyRoster(dutyRoster);
            saveStuff({
                dutyRoster
            }, today(date))
        }}
        associator={associateFunction}
    />;
}