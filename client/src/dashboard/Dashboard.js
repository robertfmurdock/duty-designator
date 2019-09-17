import React from 'react';
import FetchService from '../services/fetchService';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: []
        }
    }

    componentDidMount() {
        FetchService.get(0, "url", undefined)
            .then( response => {
                const { rows } = response;
                this.setState({ rows });
            })
            .catch(err => console.warn(err));

        // Fake Data
        // this.setState({
        //     rows: [
        //         { task: "Dishses", candidate: "Friday Jeb" },
        //         { task: "Wipe Down", candidate: "Everyday Natalie" },
        //         { task: "Tablecloth", candidate: "Odd Day Rob" }]
        // });
    }

    render = () =>
        <Paper>
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
                            <TableCell className="task" component="th" scope="row">{row.task}</TableCell>
                            <TableCell className="candidate" align="right">{row.candidate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
}