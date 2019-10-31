import React, {useState} from 'react';
import {Loading} from "./Loading";
import {loadStuff} from "../utilities/services/localStorageService";
import {format} from "date-fns";
import ChoreCorral from "../corral/ChoreCorral";
import HistoricalRoster from "../duties/HistoricalRoster";

export default function Dashboard(props) {
    const [dataLoaded, setDataLoaded] = useState(undefined);
    const [showDutyRoster, setShowDutyRoster] = useState(false);
    const date = props.date;

    if (!dataLoaded) {
        loadState(setShowDutyRoster, setDataLoaded, date);
        return <Loading/>
    }

    return showDutyRoster
        ? <HistoricalRoster date={date}/>
        : <ChoreCorral/>;
}

function loadState(setShowDutyRoster, setDataLoaded, date) {
    const localBrowserState = loadStuff(today(date));
    if (localBrowserState !== undefined) {
        setShowDutyRoster(!!localBrowserState.dutyRoster);
    }

    setDataLoaded(true);
}

const today = date => format(date, 'MM/dd/yyyy');