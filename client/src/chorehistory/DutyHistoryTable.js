import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import React from "react";

export default function DutyHistoryTable(props) {
    const {pioneer, choreCounts} = props;

    return <Box style={{padding: 16}} flex="0 0 400px">
        <Typography className="pioneer-name" variant="h5" color='textPrimary' align="center" gutterBottom>
            {pioneer.name}
        </Typography>
        <Box border={2} borderColor="text.secondary">
            <Table>
                <TableBody>
                    {choreCounts.map(chore => choreRow(chore))}
                </TableBody>
            </Table>
        </Box>
    </Box>
}

function choreRow(choreCount) {
    return <TableRow key={choreCount.id}>
        <TableCell className="chore" data-chore-id={choreCount.id}>
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