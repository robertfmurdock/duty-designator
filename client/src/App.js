import React, {useState} from 'react';
import './App.css';
import Dashboard from './dashboard/Dashboard.js';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import TodaysWagonWheel from "./dashboard/wheel/TodaysWagonWheel";
import {BrowserRouter as Router, Switch, Route, useParams, useLocation, Redirect} from "react-router-dom";
import {parse, isToday, format} from 'date-fns';
import Tumbleweed from "./tumbleweed/Tumbleweed";
import DutyRoster from "./duties/DutyRoster";
import HistoricalRoster from "./duties/HistoricalRoster";
import ChoreCorral from "./corral/ChoreCorral";
import {useHistory} from "react-router-dom";
import FetchService from "./utilities/services/fetchService";

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
                    </Switch>
                </Router>

                <Tumbleweed/>
            </MuiThemeProvider>
        </div>
    );
}

async function loadCorral(date, setCorral) {
    const results = await FetchService.get(0, `/api/corral/${date}`, undefined);
    setCorral(results);
}

const apiDateFormat = 'yyyy-MM-dd';

const DutyRosterPage = () => {
    const history = useHistory();
    const [dataLoading, setDataLoading] = useState(false);
    const [corral, setCorral] = useState(null);

    if (!dataLoading) {
        const today = format(new Date(), apiDateFormat);
        loadCorral(today, setCorral, setDataLoading)
            .catch(err => console.error(err));
        setDataLoading(true);
    }

    if (corral == null) {
        return <div/>
    }

    return <div>
        <TodaysWagonWheel date={new Date()}/>
        <DutyRoster {...corral} history={history}/>
    </div>
};

const ChoreCorralPage = () => {
    const history = useHistory();
    return <div>
        <TodaysWagonWheel date={new Date()}/>
        <ChoreCorral {...useLocation().state} history={history}/>
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
