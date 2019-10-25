import React from "react";
import {Container} from "@material-ui/core";
import DutyTable from "../tables/DutyTable";

export default function Results(props) {
    const {associator, pioneers, chores} = props;
    return <Container className="results">
        <DutyTable duties={associator(pioneers, chores)}/>
    </Container>
}