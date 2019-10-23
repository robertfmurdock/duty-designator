import React from "react";
import {Container} from "@material-ui/core";

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

        </Container>
    );
}