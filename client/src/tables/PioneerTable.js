import React from "react";
import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";

const styles = {
    cell: {
        padding: "8px 16px",
    }
};

export default function PioneerTable(props) {
    return <Box style={{padding: 16}} flex="0 0 400px">
        <Typography className="table-title" variant="h5" color='textPrimary' align="center" gutterBottom>Today's
            PIONEERS</Typography>
        <Box border={2} borderColor="text.secondary">
            <Table>
                <TableBody>
                    {props.pioneers.map(row => (
                        <TableRow key={row.id}>
                            <TableCell className="candidate" data-candidate-id={row.id} style={styles.cell}>
                                <Typography variant="h6" color='textPrimary'>
                                    {row.name}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Icon path={mdiClose} size={1} onClick={() => props.onRemove(row)}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    </Box>
}