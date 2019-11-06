import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import React from "react";

export default function DutyHistoryTable(props) {
    const {pioneer, choreCounts} = props;

    return <Box style={{padding: 16}} flex="0 0 400px">
        <Typography className="pioneer-name" variant="h5" color='textPrimary' gutterBottom>
            {pioneer.name}
        </Typography>
        <Box border={2} borderColor="text.secondary">
            <Table>
                <TableBody>
                    {something(choreCounts)}
                </TableBody>
            </Table>
        </Box>
    </Box>
}

const something = choreCounts => (
    choreCounts.length > 0
        ? choreCounts.map(chore => choreRow(chore))
        : <Typography
            className="lazy-pioneer-msg"
            variant="body2"
            color="textPrimary"
            align="center"
            gutterBottom
        >
        This is one lazy pioneer!
        </Typography>
);

function choreRow(choreCount) {
    return <TableRow key={choreCount.id} className="chore-count-row" data-chore-id={choreCount.id}>
        <TableCell>
            <Typography variant="h6" color='textPrimary' className="chore-name">
                {choreCount.name}
            </Typography>
        </TableCell>
        <TableCell align="right">
            <Typography variant="h6" color='textPrimary' className="chore-count">
                {choreCount.count}
            </Typography>
        </TableCell>
    </TableRow>;
}