import {Button, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import React from "react";

export default function (props) {
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell align="right">Today's Chores</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {props.chores.map(row => (
                <TableRow key={row.id}>
                    <TableCell className="chore" align="right" choreID={row.id}>{row.name}</TableCell>
                </TableRow>
            ))}
            <TableRow>
                <TableCell>
                    <Button id="add-chore-button" onClick={props.addChoreHandler}>
                        Add new Chore to the list</Button>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>;
}