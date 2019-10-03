import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import React from "react";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";

export default function PioneerTable(props) {
    return <Box border={1} borderColor="text.primary" style={{padding: 8}}>
        <Typography variant="h5" color='textPrimary' align="center" gutterBottom>Today's PIONEERS</Typography>
        <Table>
            <TableBody>
                {props.pioneers.map(row => (
                    <TableRow key={row.id}>
                        <TableCell className="candidate" candidateId={row.id}>{row.name}</TableCell>
                        <TableCell align="right">
                            <Icon path={mdiClose} size={1} onClick={() => props.onRemove(row)}/>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </Box>
}