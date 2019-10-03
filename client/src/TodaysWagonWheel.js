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
            <WheelSvg/>
            <Typography variant="h4">
                {format(props.date, 'MM/dd/yyyy')}
            </Typography>
        </Container>
    </Box>
}
