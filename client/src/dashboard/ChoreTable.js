import React from "react";
import {Button, Box, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import {mdiClose} from "@mdi/js";
import Icon from "@mdi/react";

export default function (props) {
    return <Box border={1} borderColor="text.primary" style={{padding: 8}}>
        <Typography variant="h5" color='textPrimary' align="center" gutterBottom>Today's CHORES</Typography>

        <Table>
            <TableBody>
                {props.chores.map(row => (
                    <TableRow key={row.id}>
                        <TableCell className="chore" choreID={row.id}>{row.name}</TableCell>
                        <TableCell>
                            <Icon path={mdiClose} size={1} onClick={() => props.onRemove(row)}/>
                        </TableCell>
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell align="right">
                        <Button id="add-chore-button" onClick={props.addChoreHandler}>
                            Add new Chore to the list
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </Box>
}