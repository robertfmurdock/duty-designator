import React from "react";
import {Button, Container, Typography} from "@material-ui/core";
import {format, subDays, addDays, isToday} from 'date-fns';
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {ReactComponent as WheelSvg} from './wheel.svg';
import {Link} from "react-router-dom";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles({
    root: {
        padding: 16,
        textAlign: 'center'
    },
});

const minusOneDay = date => formatDate(subDays(date, 1));
const plusOneDay = date => formatDate(addDays(date, 1));
const formatDate = date => format(date, 'MMddyyyy');

export default function (props) {
    const containerClasses = useStyles();

    return <Box>
        <Container fixed className={containerClasses.root}>
            <WheelSvg width="100px" height="100px" style={{maxWidth: "100%"}}/>
            <Typography variant="h4" color='textPrimary' gutterBottom>Chore Wagon Wheel</Typography>

            <Typography variant="h4" color='textPrimary' gutterBottom>
                <Link to={`/roster/${(minusOneDay(props.date))}`} className="back-btn">
                    <ChevronLeftIcon/>
                </Link>

                {format(props.date, 'MM/dd/yyyy')}

                {!isToday(props.date) &&
                <Link to={`/roster/${(plusOneDay(props.date))}`} className="forward-btn">
                    <ChevronRightIcon/>
                </Link>
                }
            </Typography>

            <Link
                to="/pioneer/statistics"
                className="statistics-link"
                style={{textDecoration: "none"}}
            >
                <Button
                    color="primary"
                    size="large"
                    variant="contained"
                >
                    Statistics
                </Button>
            </Link>
        </Container>
    </Box>
}