import React from "react";
import {Container, Typography} from "@material-ui/core";
import {format, subDays} from 'date-fns';
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {ReactComponent as WheelSvg} from './wheel.svg';
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        padding: 16,
        textAlign: 'center'
    },
});

const minusOneDay = date => format(subDays(date, 1), 'MMddyyyy');

export default function (props) {
    const containerClasses = useStyles();


    return <Box>
        <Container fixed className={containerClasses.root}>
            <WheelSvg width="100px" height="100px" style={{maxWidth: "100%"}}/>
            <Typography variant="h4" color='textPrimary' gutterBottom>Chore Wagon Wheel</Typography>
            <Link to={`/${(minusOneDay(props.date))}`} className="back-btn">Back</Link>
            <Typography variant="h4" color='textPrimary' gutterBottom>
                {format(props.date, 'MM/dd/yyyy')}
            </Typography>
        </Container>
    </Box>
}