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
                    {headerRow()}
                    {renderChoreCounts(choreCounts)}
                </TableBody>
            </Table>
        </Box>
    </Box>
}

const renderChoreCounts = choreCounts => (
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

const styles = {cell: {padding: "8px 16px",}};

function headerRow() {
    return <TableRow>
        <TableCell style={styles.cell}>
            <Typography variant="h6" color='textPrimary'>
                <strong>CHORE</strong>
            </Typography>
        </TableCell>
        <TableCell style={styles.cell}>
            <Typography variant="h6" color='textPrimary'>
                <strong>LAST DONE</strong>
            </Typography>
        </TableCell>
        <TableCell style={styles.cell}>
            <Typography variant="h6" color='textPrimary'>
                <strong>TIMES COMPLETED</strong>
            </Typography>
        </TableCell>
    </TableRow>;
}

function choreRow(choreCount) {
    return <TableRow key={choreCount.id} className="chore-count-row" data-chore-id={choreCount.id}>
        <TableCell>
            <Typography variant="h6" color='textPrimary' className="chore-name">
                {choreCount.name}
            </Typography>
        </TableCell>
        <TableCell>
            <Typography variant="h6" color='textPrimary' className="chore-date">
                {choreCount.date}
            </Typography>
        </TableCell>
        <TableCell>
            <Typography variant="h6" color='textPrimary' className="chore-count">
                {choreCount.count}
            </Typography>
        </TableCell>
    </TableRow>;
}