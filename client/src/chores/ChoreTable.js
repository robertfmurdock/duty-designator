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
    const {chores, onRemove, addChoreHandler} = props;
    return <Box style={{padding: 16}} flex="0 0 400px">
        <Typography className="table-title" variant="h5" color='textPrimary' align="center" gutterBottom>
            Today's CHORES
        </Typography>
        <Box border={2} borderColor="text.secondary">
            <Table>
                <TableBody>
                    {chores.map(chore => (choreRow(chore, onRemove)))}
                    {addChoreRow(addChoreHandler)}
                </TableBody>
            </Table>
        </Box>
    </Box>
}

function choreRow(chore, onRemove) {
    return <TableRow key={chore.id}>
        <TableCell className="chore-name" data-chore-id={chore.id} style={styles.cell}>
            <Typography variant="h6" color='textPrimary'>
                {chore.name}
            </Typography>
        </TableCell>
        <TableCell align="right" style={styles.cell}>
            <Icon path={mdiClose} size={1} onClick={() => onRemove(chore)}/>
        </TableCell>
    </TableRow>;
}

function addChoreRow(addChoreHandler) {
    return <TableRow>
        <TableCell style={styles.cell}>
            <button id="add-chore-button" onClick={addChoreHandler}>
                <Typography variant="h6" color='textPrimary'>
                    <strong>Add new Chore to the list</strong>
                </Typography>
            </button>
        </TableCell>

        <TableCell align="right" style={styles.cell}>
            <Icon path={mdiPlus} size={1} color="primary.main" onClick={addChoreHandler}/>
        </TableCell>
    </TableRow>;
}
