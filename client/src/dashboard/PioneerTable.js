import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import React from "react";

export default function PioneerTable(props) {
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell align="right">Today's Pioneers</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {props.pioneers.map(row => (
                <TableRow key={row.id}>
                    <TableCell className="candidate" align="right" candidateId={row.id}>{row.name}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>;
}