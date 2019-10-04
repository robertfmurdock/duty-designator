import React from "react";
import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import Icon from "@mdi/react";
import {mdiPlus, mdiClose} from "@mdi/js";

const styles = {
    cell: {
        padding: "8px 16px",
    }
};

export default function (props) {
    return <Box style={{padding: 16}} flex="0 0 400px">
        <Typography className="table-title" variant="h5" color='textPrimary' align="center" gutterBottom>Today's CHORES</Typography>
        <Box border={2} borderColor="text.secondary">
            <Table>
                <TableBody>
                    {props.chores.map(row => (
                        <TableRow key={row.id}>
                            <TableCell className="chore" data-chore-id={row.id} style={styles.cell}>
                                <Typography variant="h6" color='textPrimary'>
                                    {row.name}
                                </Typography>
                            </TableCell>
                            <TableCell align="right" style={styles.cell}>
                                <Icon path={mdiClose} size={1} onClick={() => props.onRemove(row)}/>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell style={styles.cell}>
                            <a
                                id="add-chore-button"
                                onClick={props.addChoreHandler}
                            >
                                <Typography variant="h6" color='textPrimary'>
                                    <strong>Add new Chore to the list</strong>
                                </Typography>
                            </a>
                        </TableCell>

                        <TableCell align="right" style={styles.cell}>
                            <Icon path={mdiPlus} size={1} color="primary.main" onClick={props.addChoreHandler}/>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    </Box>
}