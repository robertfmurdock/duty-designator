import React from "react";
import {Container, Typography} from "@material-ui/core";
import {format} from 'date-fns';
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {ReactComponent as WheelSvg} from './wheel.svg';

const useStyles = makeStyles({
    root: {
        padding: 16,
        textAlign: 'center'
    },
});

export default function (props) {
    const containerClasses = useStyles();
    return <Box>
        <Container fixed className={containerClasses.root}>
            <WheelSvg width="100px" height="100px" style={{maxWidth: "100%"}}/>
            <Typography variant="h4" color='textPrimary' gutterBottom>Chore Wagon Wheel</Typography>
            <Typography variant="h4" color='textPrimary' gutterBottom>
                {format(props.date, 'MM/dd/yyyy')}
            </Typography>
        </Container>
    </Box>
}
