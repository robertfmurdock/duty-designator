import React from 'react';
import './App.css';
import Dashboard from './dashboard/Dashboard.js';
import Results from './results/Results';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import TodaysWagonWheel from "./TodaysWagonWheel";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

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

function App() {
    return (
        <div style={{padding: 32}}>
            <MuiThemeProvider theme={theme}>
                <TodaysWagonWheel date={new Date()}/>
                <Router>
                    <Switch>
                        <Route exact path="/">
                            <Dashboard/>
                        </Route>
                        <Route exact path="/results">
                            <Results/>
                        </Route>
                    </Switch>
                </Router>
            </MuiThemeProvider>
        </div>

    );
}

export default App;
