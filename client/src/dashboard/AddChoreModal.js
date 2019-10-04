import React from "react";
import {IconButton, TextField, Button, Dialog, DialogContent, Typography} from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {withStyles} from "@material-ui/core/styles";
import {Work} from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';

export default class AddChoreModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: ""
        };
    }

    styles = theme => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.text.primary,
        },
    });

    updateName = e => this.setState({name: e.target.value});

    updateDescription = e => this.setState({description: e.target.value});

    addChore = () => {
        const {name, description} = this.state;
        this.props.addChore(name, description);
    };

    render() {
        const DialogTitle = withStyles(this.styles)(props => {
            const {children, classes, onClose} = props;
            return (
                <MuiDialogTitle disableTypography className={classes.root}>
                    <Typography variant="h6">{children}</Typography>
                    {onClose ? (
                        <IconButton id={"closeModalButton"} aria-label="close" className={classes.closeButton}
                                    onClick={onClose}>
                            <CloseIcon/>
                        </IconButton>
                    ) : null}
                </MuiDialogTitle>
            );
        });

        return <Dialog className="add-chore-modal"
                       aria-labelledby="customized-dialog-title"
                       open={this.props.open}
                       onClose={this.props.onClose}>
            <DialogTitle id="customized-dialog-title" onClose={this.props.onClose}>
                <Work/>
            </DialogTitle>

            <DialogContent>
                <TextField
                    id="chore-name"
                    label="What is the name of Chore you want to add to the list?"
                    placeholder="Add Chore Here"
                    InputLabelProps={{shrink: true}}
                    onChange={this.updateName}
                    autoFocus
                    margin="dense"
                    fullWidth
                />

                <TextField
                    id="chore-description"
                    label="What is the description of Chore you want to add to the list?"
                    placeholder="Add Description Name"
                    InputLabelProps={{shrink: true}}
                    onChange={this.updateDescription}
                    margin="dense"
                    fullWidth
                />

                <Button
                    variant="contained"
                    color="primary"
                    id='save-chore-button'
                    disabled={!this.state.name}
                    onClick={this.addChore}>
                    Update Chore List
                </Button>
            </DialogContent>
        </Dialog>;
    }
}