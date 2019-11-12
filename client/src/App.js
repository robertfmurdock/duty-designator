import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route, useParams, Redirect, useHistory, useLocation} from "react-router-dom";
import {parse, isToday, format} from 'date-fns';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import Dashboard from './dashboard/Dashboard.js';
import TodaysWagonWheel from "./dashboard/wheel/TodaysWagonWheel";
import Tumbleweed from "./tumbleweed/Tumbleweed";
import DutyRoster from "./duties/DutyRoster";
import HistoricalRoster from "./duties/HistoricalRoster";
import Corral from "./corral/Corral";
import PioneerDutyHistory from "./dutyHistory/PioneerDutyHistory";
import FetchService from "./utilities/services/fetchService";
import PioneerStatistics from "./pioneers/PioneerStatistics";
import './App.css';
import {Loading} from "./dashboard/Loading";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#1aae9f",
            contrastText: "#fff"
        },
        text: {
            primary: "#293845",
            secondary: "#c3cfd9"
        }
    }
});

export default function App() {
    return (
        <div style={{padding: 32}}>
            <MuiThemeProvider theme={theme}>
                <Router>
                    <Switch>
                        <Route exact path="/" children={<WithoutDate/>}/>
                        <Route exact path="/corral" component={ChoreCorralPage}/>
                        <Route exact path="/roster" component={DutyRosterPage}/>
                        <Route path="/roster/:date" children={<WithDate/>}/>
                        <Route path="/pioneer/:id/history" children={<PioneerHistory/>}/>
                        <Route path="/pioneer/statistics" component={PioneerStatistics}/>
                    </Switch>
                </Router>
                <Tumbleweed/>
            </MuiThemeProvider>
        </div>
    );
}

async function loadCorral(date) {
    try {
        return await FetchService.get(0, `/api/corral/${date}`, undefined);
    } catch (err) {
        if (err === 404) {
            const [pioneers, chores] = await Promise.all([
                FetchService.get(0, `/api/pioneer`, undefined),
                FetchService.get(0, `/api/chore`, undefined)
            ]);

            return {pioneers, chores, date: date};
        }
    }
}

const apiDateFormat = 'yyyy-MM-dd';

async function getDutyRosterData(today) {
    const [dutyRoster, corral] = await Promise.all([
        loadDutyRoster(today),
        loadCorral(today)
    ]);

    return {dutyRoster, corral};
}

async function loadDutyRoster(date) {
    try {
        return await FetchService.get(0, `/api/roster/${date}`, undefined);
    } catch (err) {
        return null;
    }
}

const DutyRosterPage = () => {
    const history = useHistory();
    const location = useLocation();
    const urlSearchParams = new URLSearchParams(location.search);
    const shouldSpin = urlSearchParams.get('spin');

    const [dataLoading, setDataLoading] = useState(false);
    const [data, setData] = useState(null);

    if (!dataLoading) {
        const today = format(new Date(), apiDateFormat);
        getDutyRosterData(today)
            .then(setData)
            .catch(err => console.error(err));
        setDataLoading(true);
    }

    if (data == null) {
        return <Loading/>
    }

    const roster = shouldSpin ? null : data.dutyRoster;

    return <div>
        <TodaysWagonWheel date={new Date()}/>
        <DutyRoster dutyRoster={roster} {...data.corral} history={history}/>
    </div>
};

const ChoreCorralPage = () => {
    const history = useHistory();
    const [dataLoading, setDataLoading] = useState(false);
    const [corral, setCorral] = useState(null);

    if (!dataLoading) {
        const today = format(new Date(), apiDateFormat);
        loadCorral(today)
            .then(setCorral)
            .catch(err => console.error(err));

        setDataLoading(true);
    }

    if (corral == null) {
        return <div/>
    }
    return <div>
        <TodaysWagonWheel date={new Date()}/>
        <Corral {...corral} history={history}/>
    </div>
};

const WithoutDate = () => {
    const date = new Date();
    return <div>
        <Dashboard date={date}/>
    </div>
};

const WithDate = () => {
    let {date} = useParams();
    const parsedDate = parse(date, "MMddyyyy", new Date());
    return isToday(parsedDate)
        ? <Redirect to="/"/>
        : <div>
            <TodaysWagonWheel date={parsedDate}/>
            <HistoricalRoster date={parsedDate}/>
        </div>
};

const PioneerHistory = () => {
    const {id} = useParams();
    return <PioneerDutyHistory id={id}/>
};