import React from 'react';
import FetchService from '../services/fetchService';
import {Box, Button, Container} from '@material-ui/core';
import {AddChoreModal, ChoreTable, PioneerTable} from './index';
import Results from '../results/Results'
import associate from "../results/Associator";

const associateFunction = associate;

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pioneers: [],
            chores: [],
            hasBeenClicked: false,
            modalOpen: false,
            assignmentsSaved: false,
        }
    }

    componentDidMount() {
        this.populateTableState();
    }

    populateTableState() {
        FetchService.get(0, "/api/candidate", undefined)
            .then(response => this.setState({pioneers: response}))
            .catch(err => console.warn(err));

        FetchService.get(0, "/api/chore", undefined)
            .then(response => this.setState({chores: response}))
            .catch(err => console.warn(err));
    }

    addChore = (name, description) => {
        const id = (this.state.chores.length + 1).toString();
        const newChore = {id, name, description};
        this.setState({modalOpen: false, chores: [...this.state.chores, newChore]});
    };

    handleClickOpen = () => this.setState({modalOpen: true});

    handleClose = () => this.setState({modalOpen: false});

    getPioneerTable = () => (
        <PioneerTable
            pioneers={this.state.pioneers}
            onRemove={removedPioneer => {
                this.setState({
                    pioneers: this.state.pioneers.filter(
                        pioneer => pioneer !== removedPioneer
                    )
                })
            }}
        />
    );

    getChoreTable = () => (
        <ChoreTable
            chores={this.state.chores}
            addChoreHandler={this.handleClickOpen}
            onRemove={removedChore => {
                this.setState({
                    chores: this.state.chores.filter(
                        chore => chore !== removedChore
                    )
                })
            }}
        />
    );


    render() {
        const resetButton = <Button
            color="primary"
            size="large"
            variant="contained"
            id="reset-button"
            onClick={() => {this.populateTableState()}}>
            Reset
        </Button>;

        const saddleUpButton = <Button
            color="primary"
            size="large"
            variant="contained"
            id="saddle-up"
            onClick={() => {this.setState({hasBeenClicked: true})}}>
            Saddle Up
        </Button>;

        const addChoreModal = < AddChoreModal
            open={this.state.modalOpen}
            onClose={this.handleClose}
            addChore={this.addChore}
        />;

        const respinButton = <Button
            color="secondary"
            size="large"
            variant="contained"
            id="respin"
            onClick={() => {this.setState({hasBeenClicked: false})}}>
            Respin this Wagon Wheel
        </Button>;

        const saveButton = <Button
            color="primary"
            size="large"
            variant="contained"
            id="save"
            onClick={() => {this.setState({assignmentsSaved: true})}}>
            Save this Wagon Wheel
        </Button>;

        let conditionallyRenderSavedConfirmation = () => {
            if (this.state.assignmentsSaved) {
                return <p id='saved-confirmation'>Save Confirmed!</p>
            }
        }

        let conditionallyRenderResultsButtons = () => {
            if (!this.state.assignmentsSaved) {
                return <div>{respinButton}
                    {saveButton}</div>;
            }
        }

        if (!this.state.hasBeenClicked) {
            return <div>
                <Container>
                    <Box display="flex" flexDirection="row" justifyContent="center">
                        {this.getPioneerTable()}
                        {this.getChoreTable()}
                    </Box>
                    <Box>
                        {resetButton}
                        {saddleUpButton}
                        {addChoreModal}
                    </Box>
                </Container>
            </div>;
        } else {
            return <Container>
                <Results pioneers={this.state.pioneers} chores={this.state.chores} associator={associateFunction}/>
                {conditionallyRenderResultsButtons()}
                {conditionallyRenderSavedConfirmation()}
            </Container>
        }
    }


}

