import React from "react";
import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";

const styles = {
    cell: {
        padding: "8px 16px",
    }
};

export default function DutyTable(props) {
    return <Box style={{padding: 16}} flex="0 0 400px">
        <Box border={2} borderColor="text.secondary">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell style={styles.cell}>
                            <Typography variant="h6" color='textPrimary'>
                                <strong>PIONEER</strong>
                            </Typography>
                        </TableCell>
                        <TableCell style={styles.cell}>
                            <Typography variant="h6" color='textPrimary'>
                                <strong>CHORE</strong>
                            </Typography>
                        </TableCell>
                        <TableCell style={styles.cell}>
                            <Typography variant="h6" color='textPrimary'>
                                <strong>DESCRIPTION</strong>
                            </Typography>
                        </TableCell>
                    </TableRow>
                    {props.duties.map(row => (
                        <TableRow key={row.id}>
                            <TableCell className="duty" data-duty-id={row.id} style={styles.cell}>
                                <Typography variant="h6" color='textPrimary'>
                                    {row.name}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    </Box>
}