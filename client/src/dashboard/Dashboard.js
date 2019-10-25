import React from 'react';
import FetchService from '../utilities/services/fetchService';
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
        const state = this.loadStuff('savedState');
        if (state === undefined) {
            this.populateTableState()
        } else {
            this.setState(state)
        }
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

    saveStuff = (stuff, key) => {
        try {
            const serializedState = JSON.stringify(stuff);
            localStorage.setItem(key, serializedState);
        } catch (err) {
        }
    };

    loadStuff = (key) => {
        try {
            const serializedState = localStorage.getItem(key);
            return serializedState ? JSON.parse(serializedState) : undefined;
        } catch (err) {
            return undefined;
        }
    };

    render() {
        if (!this.state.hasBeenClicked) {
            return this.setupPage();
        } else {
            return this.resultsPage()
        }
    }

    setupPage() {
        return <div>
            <Container>
                <Box display="flex" flexDirection="row" justifyContent="center">
                    {this.getPioneerTable()}
                    {this.getChoreTable()}
                </Box>
                <Box>
                    {this.resetButton()}
                    {this.saddleUpButton()}
                    {this.addChoreModal()}
                </Box>
            </Container>
        </div>;
    }

    resultsPage() {
        return <Container>
            <Results pioneers={this.state.pioneers} chores={this.state.chores} associator={associateFunction}/>
            {this.respinButton()}
            {this.conditionallyRenderResultsButtons()}
            {this.conditionallyRenderSavedConfirmation()}
        </Container>;
    }

    conditionallyRenderResultsButtons() {
        if (!this.state.assignmentsSaved) {
            return <div>
                {this.saveButton()}</div>;
        }
    }

    conditionallyRenderSavedConfirmation() {
        if (this.state.assignmentsSaved) {
            return <p id='saved-confirmation'>Save Confirmed!</p>
        }
    }

    saveButton() {
        return <Button
            color="primary"
            size="large"
            variant="contained"
            id="save"
            onClick={() => {
                this.setState({assignmentsSaved: true},
                    () => {
                        this.saveStuff(this.state, 'savedState')
                    })
            }}>
            Save this Wagon Wheel
        </Button>;
    }

    respinButton() {
        return <Button
            color="secondary"
            size="large"
            variant="contained"
            id="respin"
            onClick={() => {
                this.setState({hasBeenClicked: false, assignmentsSaved: false})
            }}>
            Respin this Wagon Wheel
        </Button>;
    }

    addChoreModal() {
        return < AddChoreModal
            open={this.state.modalOpen}
            onClose={this.handleClose}
            addChore={this.addChore}
        />;
    }

    saddleUpButton() {
        return <Button
            color="primary"
            size="large"
            variant="contained"
            id="saddle-up"
            onClick={() => {
                this.setState({hasBeenClicked: true})
            }}>
            Saddle Up
        </Button>;
    }

    resetButton() {
        return <Button
            color="primary"
            size="large"
            variant="contained"
            id="reset-button"
            onClick={() => {
                this.populateTableState()
            }}>
            Reset
        </Button>;
    }
}

