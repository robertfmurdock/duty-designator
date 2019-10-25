import React, {useState} from "react";
import {Button, Dialog, DialogContent, IconButton, TextField, Typography} from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {withStyles} from "@material-ui/core/styles";
import {Work} from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
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

const DialogTitle = withStyles(styles)(props => {
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

export default function AddChoreModal(props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    return <Dialog className="add-chore-modal"
                   aria-labelledby="customized-dialog-title"
                   open={props.open}
                   onClose={props.onClose}>
        <DialogTitle id="customized-dialog-title" onClose={props.onClose}>
            <Work/>
        </DialogTitle>

        <DialogContent>
            <TextField
                id="chore-name"
                label="What is the name of Chore you want to add to the list?"
                placeholder="Add Chore Here"
                InputLabelProps={{shrink: true}}
                onChange={e => setName(e.target.value)}
                autoFocus
                margin="dense"
                fullWidth
            />

            <TextField
                id="chore-description"
                label="What is the description of Chore you want to add to the list?"
                placeholder="Add Description Name"
                InputLabelProps={{shrink: true}}
                onChange={e => setDescription(e.target.value)}
                margin="dense"
                fullWidth
            />

            <Button
                variant="contained"
                color="primary"
                id='save-chore-button'
                disabled={!name}
                onClick={() => props.addChore(name, description)}>
                Update Chore List
            </Button>
        </DialogContent>
    </Dialog>;
}
