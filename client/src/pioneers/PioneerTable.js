import React from "react";
import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";

const styles = {
    cell: {
        padding: "8px 16px",
    }
};

function pioneerRow(pioneer, onRemove) {
    return <TableRow key={pioneer.id}>
        <TableCell className="candidate" data-candidate-id={pioneer.id} style={styles.cell}>
            <Typography variant="h6" color='textPrimary'>
                {pioneer.name}
            </Typography>
        </TableCell>
        <TableCell align="right">
            <Icon data-candidate-id={pioneer.id} className={'delete'} path={mdiClose} size={1} onClick={() => onRemove(pioneer)}/>
        </TableCell>
    </TableRow>;
}

export default function PioneerTable(props) {
    const {pioneers, onRemove} = props;
    return <Box style={{padding: 16}} flex="0 0 400px">
        <Typography className="table-title" variant="h5" color='textPrimary' align="center" gutterBottom>
            Today's PIONEERS
        </Typography>
        <Box border={2} borderColor="text.secondary">
            <Table>
                <TableBody>
                    {pioneers.map(pioneer => pioneerRow(pioneer, onRemove))}
                </TableBody>
            </Table>
        </Box>
    </Box>
}