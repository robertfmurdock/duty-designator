import React, {useState} from "react";
import {Box, Button, Dialog, DialogContent, IconButton, TextField, Typography} from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {withStyles} from "@material-ui/core/styles";
import {Work} from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';



export default function AddChoreModal(props) {
    const {open, onClose, onChoreAdd} = props;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    return <Dialog className="add-chore-modal"
                   aria-labelledby="customized-dialog-title"
                   open={open}
                   onClose={onClose}>
        <Box p={2} border={20}>
            <DialogTitle id="customized-dialog-title" onClose={onClose}>
                <Work/>
            </DialogTitle>

            <DialogContent>
                <Box p={0.5}>
                <Typography>What is the name of Chore you want to add to the list?</Typography>
                {nameTextField(setName)}
                </Box>
                <Box p={0.5}>
                <Typography>What is the description of Chore you want to add to the list?</Typography>
                {descriptionTextField(setDescription)}
                </Box>
                <Box p={0.5}>
                <Typography>What are the doers called?</Typography>
                {titleTextField(setTitle)}
                </Box>

                <Box m={0} p={3}>
                    {saveButton(name, description, onChoreAdd, title)}
                </Box>

            </DialogContent>
        </Box>
    </Dialog>;
}

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(4),
        top: theme.spacing(3),
        color: theme.palette.text.primary,
    },
});




function closeButton(classes, onClose) {
    return <IconButton
        id={"closeModalButton"}
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
    >
        <CloseIcon/>
    </IconButton>;
}

const DialogTitle = withStyles(styles)(props => {
    const {children, classes, onClose} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? closeButton(classes, onClose) : null}
        </MuiDialogTitle>
    );
});

function nameTextField(setName) {
    return <TextField
        id="chore-name"
        placeholder="Add Chore Here"
        InputLabelProps={{shrink: true}}
        onChange={e => setName(e.target.value)}
        autoFocus
        margin="dense"
        variant={"outlined"}
        fullWidth
    />;
}

function descriptionTextField(setDescription) {
    return <TextField
        id="chore-description"
        placeholder="Add Description Here"
        InputLabelProps={{shrink: true}}
        onChange={e => setDescription(e.target.value)}
        margin="dense"
        variant={"outlined"}
        fullWidth
    />;
}

function titleTextField(setTitle) {
    return <TextField
        id="chore-title"
        placeholder="Add Title Here"
        InputLabelProps={{shrink: true}}
        onChange={e => setTitle(e.target.value)}
        margin="dense"
        variant={"outlined"}
        fullWidth
    />;
}

function saveButton(name, description, onChoreAdd, title) {
    return <Button
        variant="contained"
        color="primary"
        id='save-chore-button'
        disabled={!name}
        onClick={() => onChoreAdd({name, description, title})}>
        Update Chore List
    </Button>;
}

