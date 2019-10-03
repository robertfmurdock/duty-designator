import React from 'react';
import FetchService from '../services/fetchService';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Paper,
    Grid
} from '@material-ui/core';
import AddChoreModal from "./AddChoreModal";
import PioneerTable from "./PioneerTable";
import ChoreTable from "./ChoreTable";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pioneers: [],
            chores: [],
            modalOpen: false
        }
    }

    componentDidMount() {
        this.populateTableState();
    }


    populateTableState() {
        FetchService.get(0, "/api/candidate", undefined)
            .then(response => this.setState({pioneers: response}))
            .catch(err => console.warn(err));

        FetchService.get(0, "/api/chore", undefined)
            .then(response => this.setState({chores: response}))
            .catch(err => console.warn(err));
    }

    render() {
        const handleClickOpen = () => {
            this.setState({modalOpen: true})
        };

        const handleClose = () => {
            this.setState({modalOpen: false})
        };

        return <Grid container spacing={2}>
            <Grid item xs={6}>
                <Paper>
                    <PioneerTable pioneers={this.state.pioneers} onRemove={removedPioneer => {
                        this.setState({
                            pioneers: this.state.pioneers.filter(
                                pioneer => pioneer !== removedPioneer
                            )
                        })
                    }}/>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper>
                    {this.getChoreTable(handleClickOpen)}
                    <AddChoreModal open={this.state.modalOpen} onClose={handleClose}/>
                </Paper>
            </Grid>

            <Button
                color={'primary'}
                size={"large"}
                variant={"contained"}
                id="reset-button"
                onClick={() => this.populateTableState()}
            >
                Reset
            </Button>
        </Grid>

    }

    getChoreTable(handleClickOpen) {
        return <ChoreTable chores={this.state.chores} addChoreHandler={handleClickOpen} />

    }
}

