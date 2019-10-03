import React from 'react';
import FetchService from '../services/fetchService';
import {Box, Button} from '@material-ui/core';
import {AddChoreModal, ChoreTable, PioneerTable} from './index';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pioneers: [],
            chores: [],
            modalOpen: false
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

    handleClickOpen = () => {
        this.setState({modalOpen: true})
    };

    handleClose = () => {
        this.setState({modalOpen: false})
    };

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

    render = () => (
        <Box display="flex" flexDirection="row" justifyContent="center">
            <div>
                {this.getPioneerTable()}
            </div>

            <div>
                {this.getChoreTable()}

                <Button
                    color={'primary'}
                    size={"large"}
                    variant={"contained"}
                    id="reset-button"
                    onClick={() => this.populateTableState()}
                >
                    Reset
                </Button>
            </div>

            <AddChoreModal open={this.state.modalOpen} onClose={this.handleClose}/>
        </Box>
    );
}

