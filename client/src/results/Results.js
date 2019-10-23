import React from "react";
import {Container} from "@material-ui/core";
import DutyTable from "../tables/DutyTable";

export default class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pioneers: [],
            chores: [],
            duties: props.duties
        }
    }

    render = () => (
        <Container className="results">
                <DutyTable duties={this.props.associator(this.props.pioneers, this.props.chores)}/>
        </Container>
    );
}