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
            rows: []
        }
    }

    componentDidMount() {
        FetchService.get(0, "/api/candidate", undefined)
            .then(response => this.setState({rows: response}))
            .catch(err => console.warn(err));
    }

    render() {
        return <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tasks</TableCell>
                        <TableCell align="right">Candidates</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.rows.map(row => (
                        <TableRow key={row.task}>
                            <TableCell className="candidate" align="right" candidateId={row.id}>{row.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    }
}