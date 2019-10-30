import React from 'react';
import './App.css';
import Dashboard from './dashboard/Dashboard.js';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import TodaysWagonWheel from "./dashboard/wheel/TodaysWagonWheel";
import {BrowserRouter as Router, Switch, Route, useParams} from "react-router-dom";
import {parse} from 'date-fns';

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
                        <Route exact path="/" children={<Today/>}/>
                        <Route path="/:date" children={<DateSpecificDash/>}/>
                    </Switch>
                </Router>
            </MuiThemeProvider>
        </div>
    );
}

function Today() {
    const today = new Date();
    return (
        <div>
            <TodaysWagonWheel date={today}/>
            <Dashboard date={today}/>
        </div>
    );
}

function DateSpecificDash() {
    let {date} = useParams();
    const parsedDate = parse(date, "MMddyyyy", new Date());

    return (
        <div>
            <TodaysWagonWheel date={parsedDate}/>
            <Dashboard date={parsedDate}/>
        </div>
    );
}