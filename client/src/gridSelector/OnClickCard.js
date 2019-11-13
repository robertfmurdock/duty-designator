import React from "react";
import Card from "@material-ui/core/Card";
import Icon from "@mdi/react";
import {mdiPlus} from "@mdi/js";
import IconButton from "@material-ui/core/IconButton";

export default function OnClickCard(props) {
    const {clickEventHandler} = props;
    const styles = {
        iconCard: {
            height: "100%",
            position: 'relative',
            textAlign: "center",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        iconButton: {
            width: 100,
            height: 100
        },
        icon: {
            width: '100%',
            height: '100%'
        }
    };

    return <Card className={'open-add-chore-modal-button'} onClick={clickEventHandler}
                 style={styles.iconCard}>
        <IconButton style={styles.iconButton}>
            <Icon path={mdiPlus} style={styles.icon}/>
        </IconButton>
    </Card>
}