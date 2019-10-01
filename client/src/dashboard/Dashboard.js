import React from 'react';
import FetchService from '../services/fetchService';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper
} from '@material-ui/core';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pioneers: [],
            chores: []
        }
    }

    componentDidMount() {
        FetchService.get(0, "/api/candidate", undefined)
            .then(response => this.setState({pioneers: response}))
            .catch(err => console.warn(err));

        FetchService.get(0, "/api/chore", undefined)
            .then(response => this.setState({chores: response}))
            .catch(err => console.warn(err));
    }

    render() {
        return <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="right">Today's Pioneers</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.pioneers.map(row => (
                        <TableRow key={row.id}>
                            <TableCell className="candidate" align="right" candidateId={row.id}>{row.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Table>
            <TableHead>
                    <TableRow>
                        <TableCell align="right">Today's Chores</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.chores.map(row => (
                        <TableRow key={row.id}>
                            <TableCell className="chore" align="right">{row.name}</TableCell>
                        </TableRow>
                    ))} 

                </TableBody>
            </Table>
        </Paper>
    }
}