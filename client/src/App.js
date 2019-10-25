import React from 'react';
import './App.css';
import Dashboard from './dashboard/Dashboard.js';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import TodaysWagonWheel from "./dashboard/wheel/TodaysWagonWheel";

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
                <TodaysWagonWheel date={new Date()}/>
                <Dashboard/>
            </MuiThemeProvider>
        </div>
    );
}
