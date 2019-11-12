import React from "react";
import CorralCard from "./CorralCard";
import OnClickCard from "./OnClickCard";
import Grid from "@material-ui/core/Grid";

export default function GridSelector(props) {
    const {items, onRemove, gridAddItemOnClick, showGridAddItem} = props;

    function ifShowGridAddItem() {
        return showGridAddItem ? <Grid item height="100%">
            <OnClickCard clickEventHandler={gridAddItemOnClick}/>
        </Grid> : undefined
    }

    return <Grid container spacing={2} wrap="wrap">

        {items.map(item => <Grid item height="" key={item.id}>
                <CorralCard {...{item, key: item.id, removable: true}}
                            onRemove={() => {
                                onRemove(item)
                            }}/>
            </Grid>
        )}
        {ifShowGridAddItem()}
    </Grid>
}