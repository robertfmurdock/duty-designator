import React, {useState} from 'react';
import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import FetchService from "../utilities/services/fetchService";
import {loadStuff} from "../utilities/services/localStorageService";

export default function ChoreHistory(props) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [pioneer, setPioneer] = useState(undefined);
    const [choreCounts, setChoreCounts] = useState([]);

    if (!dataLoaded) {
        setPioneerFromServer(props.id, pioneer, setPioneer);
        findPioneerDutyInLocalStorage(props.id, setPioneer, setChoreCounts);
        setDataLoaded(true); // will need to be moved to take async fetch into account
    }

    // console.log(pioneer);
    // console.log(choreCounts);

    return <div>
        <Typography variant="h1" className="history-header">Pioneer History</Typography>
        {conditionalRender(pioneer, choreCounts)}
    </div>;
}

const conditionalRender = (pioneer, chores) => (
    pioneer
        ? choreList(pioneer, chores)
        : <Typography
            variant="body1"
            color="textPrimary"
            className="no-pioneer"
        >
            No pioneer data found
        </Typography>
);

const choreList = (pioneer, choreCounts) => (
    <Box style={{padding: 16}} flex="0 0 400px">
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
);

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

function flattenList(rosters) {
    return [].concat.apply([], rosters);
}

function findPioneerDutyInLocalStorage(id, setPioneer, setChoreCounts) {
    let rosters = Object.keys(localStorage)
        .map(date => loadStuff(date).dutyRoster)
        .filter(roster => roster !== false);

    let duties = flattenList(rosters);

    const dutyWithMatchedPioneerId = duties.find(duty => duty.pioneer.id === id);

    if (dutyWithMatchedPioneerId) {
        let choresWithCounts = [];
        duties.forEach(duty => {
            const chore = duty.chore;
            const count = choresWithCounts.find(choreCount => choreCount.id === chore.id);

            if(count) {
                count.count++;
            } else {
                choresWithCounts.push({id: chore.id, name: chore.name, count: 1});
            }
        });

        choresWithCounts.sort((a,b) => a.count - b.count);
        setPioneer(dutyWithMatchedPioneerId.pioneer);
        setChoreCounts(choresWithCounts)
    }
}

function setPioneerFromServer(id, currentPioneer, setPioneer) {
    FetchService.post(0, "/api/pioneerById", {id}, undefined)
        .then(pioneer => {
            if(!currentPioneer) {
                setPioneer(pioneer);
            }
        })
        .catch(err => console.warn("Problem fetching pioneer", err));
}