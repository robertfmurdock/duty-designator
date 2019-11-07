import React from "react";
import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";

export default function DutyTable(props) {
    const duties = props.duties;
    return <Box style={{padding: 16}}>
        <Box border={2} borderColor="text.secondary">
            <Table className="results">
                <TableBody>
                    {headerRow()}
                    {duties.map(duty => dutyRow(duty))}
                </TableBody>
            </Table>
        </Box>
    </Box>
}

const styles = {cell: {padding: "8px 16px",}};

function headerRow() {
    return <TableRow>
        <TableCell style={styles.cell}>
            <Typography variant="body1" color='textPrimary'>
                <strong>TITLE</strong>
            </Typography>
        </TableCell>
        <TableCell style={styles.cell}>
            <Typography variant="body1" color='textPrimary'>
                <strong>PIONEER</strong>
            </Typography>
        </TableCell>
        <TableCell style={styles.cell}>
            <Typography variant="body1" color='textPrimary'>
                <strong>CHORE</strong>
            </Typography>
        </TableCell>
        <TableCell style={styles.cell}>
            <Typography variant="body1" color='textPrimary'>
                <strong>DESCRIPTION</strong>
            </Typography>
        </TableCell>
    </TableRow>;
}

function dutyRow(duty) {
    return <TableRow key={duty.chore.id}>
        <TableCell className="duty-pioneer-title" data-chore-id={duty.chore.id} style={styles.cell}>
            <Typography variant="body1" color='textPrimary'>
                {duty.chore.title}
            </Typography>
        </TableCell>
        <TableCell className="duty-pioneer-name" data-pioneer-id={duty.pioneer.id} style={styles.cell}>
            <Typography variant="body1" color='textPrimary'>
                {duty.pioneer.name}
            </Typography>
        </TableCell>
        <TableCell className="duty-chore-name" data-chore-id={duty.chore.id} style={styles.cell}>
            <Typography variant="body1" color='textPrimary'>
                {duty.chore.name}
            </Typography>
        </TableCell>
        <TableCell className="duty-chore-description" data-chore-id={duty.chore.id} style={styles.cell}>
            <Typography variant="body1" color='textPrimary'>
                {duty.chore.description}
            </Typography>
        </TableCell>
    </TableRow>;
}
