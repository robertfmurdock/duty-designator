import React from 'react';
import './App.css';
import Dashboard from './dashboard/Dashboard.js';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import TodaysWagonWheel from "./dashboard/wheel/TodaysWagonWheel";
import {BrowserRouter as Router, Switch, Route, useParams, useLocation, Redirect} from "react-router-dom";
import {parse, isToday} from 'date-fns';
import Tumbleweed from "./tumbleweed/Tumbleweed";
import DutyRoster from "./duties/DutyRoster";
import HistoricalRoster from "./duties/HistoricalRoster";
import ChoreCorral from "./corral/ChoreCorral";
import {useHistory} from "react-router-dom";

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

const DutyRosterPage = () => {
    const history = useHistory();
    return <div>
        <TodaysWagonWheel date={new Date()}/>
        <DutyRoster {...useLocation().state} history={history}/>
    </div>
};

const ChoreCorralPage = () => {
    return <div>
        <TodaysWagonWheel date={new Date()}/>
        <ChoreCorral {...useLocation().state}/>
    </div>
};

const WithoutDate = () => {
    const date = new Date();
    return <div>
        <TodaysWagonWheel date={date}/>
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
