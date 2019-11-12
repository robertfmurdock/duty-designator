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
    chevronLink: {
        width: 28,
        height: 28,
        display: "block",
    },
    chevron: {
        width: "100%",
        height: "100%"
    }
});

const minusOneDay = date => formatDate(subDays(date, 1));
const plusOneDay = date => formatDate(addDays(date, 1));
const formatDate = date => format(date, 'MMddyyyy');

export default function (props) {
    const classes = useStyles();

    return <Box>
        <Container fixed className={classes.root}>
            <WheelSvg width="100px" height="100px" style={{maxWidth: "100%"}}/>
            <Typography variant="h5" color='textPrimary' gutterBottom>Chore Wagon Wheel</Typography>

            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                style={{marginBottom: "0.35em"}}
            >
                <Link
                    to={`/roster/${(minusOneDay(props.date))}`}
                    className={`back-btn ${classes.chevronLink}`}
                >
                    <ChevronLeftIcon className={classes.chevron} style={{width: 32}}/>
                </Link>

                <Typography variant="h5" color='textPrimary'>

                    {format(props.date, 'MM/dd/yyyy')}

                </Typography>

                {!isToday(props.date) &&
                <Link
                    to={`/roster/${(plusOneDay(props.date))}`}
                    className={`forward-btn ${classes.chevronLink}`}
                >
                    <ChevronRightIcon className={classes.chevron} style={{width: 32}}/>
                </Link>
                }
            </Box>

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