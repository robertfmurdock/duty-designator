import {Button, Container, Typography} from "@material-ui/core";
import React, {useState, useEffect} from "react";
import DutyTable from "./DutyTable";
import {loadStuff} from "../utilities/services/localStorageService";
import {format, isToday} from "date-fns";
import {Loading} from "../dashboard/Loading";
import {Link} from "react-router-dom";

export default function HistoricalRoster(props) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [showDutyRoster, setShowDutyRoster] = useState(false);
    const [dutyRoster, setDutyRoster] = useState([]);
    const [date, setDate] = useState(props.date);

    useEffect(() => {
        setDate(props.date);
        setDataLoaded(false);
        setShowDutyRoster(false);
        setDutyRoster(false);
    }, [props.date]);

    if (!dataLoaded) {
        loadState(date, setShowDutyRoster, setDutyRoster, setDataLoaded);
        return <Loading/>
    }

    return <Container>
        {dutyTableOrNot(showDutyRoster, dutyRoster, date)}
    </Container>;
}

const doSomeToday = (date) => (
    <div style={{textAlign: "center"}}>
        <Typography variant="h5" color='textPrimary' gutterBottom>No chores were done today.</Typography>
        {isToday(date) &&
            <Link to="/" style={{textDecoration: "none"}}>
                <Button color="primary" size="large" variant="contained">Spin that wheel!</Button>
            </Link>
        }
    </div>
);

const dutyTableOrNot = (showDutyRoster, dutyRoster, date) =>
    showDutyRoster
        ? <DutyTable duties={dutyRoster}/>
        : doSomeToday(date);

function loadState(date, setShowDutyRoster, setDutyRoster, setDataLoaded) {
    const localBrowserState = loadStuff(today(date));
    if (localBrowserState !== undefined) {
        setShowDutyRoster(!!localBrowserState.dutyRoster);
        setDutyRoster(localBrowserState.dutyRoster);
    }
    return setDataLoaded(true);
}

const today = date => format(date, 'MM/dd/yyyy');
