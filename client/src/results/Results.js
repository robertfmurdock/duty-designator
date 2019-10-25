import React from "react";
import {Container} from "@material-ui/core";
import DutyTable from "../tables/DutyTable";

export default class Results extends React.Component {

    render = () => (
        <Container className="results">
                <DutyTable duties={this.props.associator(this.props.pioneers, this.props.chores)}/>
        </Container>
    );
}