import React from 'react';
import './App.css';
import Dashboard from './dashboard/Dashboard.js';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import TodaysWagonWheel from "./dashboard/wheel/TodaysWagonWheel";
import {BrowserRouter as Router, Switch, Route, useParams, useLocation} from "react-router-dom";
import {parse} from 'date-fns';
import Tumbleweed from "./tumbleweed/Tumbleweed";
import DutyRoster from "./duties/DutyRoster";
import HistoricalRoster from "./duties/HistoricalRoster";

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
                        <Route exact path="/roster" component={Roster}/>
                        <Route path="/roster/:date" children={<WithDate/>}/>
                    </Switch>
                </Router>

                <Tumbleweed/>
            </MuiThemeProvider>
        </div>
    );
}

const Roster = () => {
    const {pioneers, chores} = useLocation().state;
    return <div>
        <TodaysWagonWheel date={new Date()}/>
        <DutyRoster
            pioneers={pioneers}
            chores={chores}
        />
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
    return <div>
        <TodaysWagonWheel date={parsedDate}/>
        <HistoricalRoster date={parsedDate}/>
    </div>
};
