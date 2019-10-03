import React from 'react';
import './App.css';
import Dashboard from './dashboard/Dashboard.js';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {teal} from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {primary: teal}
});

function App() {
    return (
        <div style={{padding: 32}}>
            <MuiThemeProvider theme={theme}>
                <Dashboard/>
            </MuiThemeProvider>
        </div>
    );
}

export default App;
