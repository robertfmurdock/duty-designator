import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import React from "react";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";

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
                    <TableCell>
                        <Icon path={mdiClose} size={1} onClick={() => props.onRemove(row)}/>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>;
}