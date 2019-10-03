import React from 'react';
import './App.css';
import Dashboard from './dashboard/Dashboard.js';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {teal} from "@material-ui/core/colors";
import TodaysWagonWheel from "./TodaysWagonWheel";

const theme = createMuiTheme({
    palette: {
        main: teal,
        text: {
            primary: "#293845"
        }
    }
});

function App() {
    return (
        <div style={{padding: 32}}>
            <MuiThemeProvider theme={theme}>
                <TodaysWagonWheel date={new Date()}/>
                <Dashboard/>
            </MuiThemeProvider>
        </div>
    );
}

export default App;
