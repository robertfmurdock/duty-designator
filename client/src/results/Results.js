import React from "react";
import {Container, Box} from "@material-ui/core";
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
            <Box>
                <DutyTable
                    duties={this.state.duties}
                />
            </Box>
        </Container>
    );
}