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
import { Add } from '@material-ui/icons';
import AddChoreModal from "./AddChoreModal";
import PioneerTable from "./PioneerTable";

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
        FetchService.get(0, "/api/candidate", undefined)
            .then(response => this.setState({ pioneers: response }))
            .catch(err => console.warn(err));

        FetchService.get(0, "/api/chore", undefined)
            .then(response => this.setState({ chores: response }))
            .catch(err => console.warn(err));
    }


    render() {
        const handleClickOpen = () => {
            this.setState({ modalOpen: true })
        };

        const handleClose = () => {
            this.setState({ modalOpen: false })
        };

        return <Grid container spacing={2}>
            <Grid item xs={6}>
                <Paper>
                    <PioneerTable pioneers={this.state.pioneers}/>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper>
                    {this.getChoreTable(handleClickOpen)}
                    <AddChoreModal open={this.state.modalOpen} onClose={handleClose}/>
                </Paper>
            </Grid>
        </Grid>
    }

    getChoreTable(handleClickOpen) {
        return <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="right">Today's Chores</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {this.state.chores.map(row => (
                    <TableRow key={row.id}>
                        <TableCell className="chore" align="right" choreID={row.id}>{row.name}</TableCell>
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell>
                        <Button id="add-chore-button" onClick={handleClickOpen}>
                            Add new Chore to the list</Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>;
    }
}

