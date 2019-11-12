import React from 'react';
import {Redirect} from "react-router-dom";

export default function RootRoute(props) {
    return props.dutyRoster != null
        ? <Redirect to='/roster'/>
        : <Redirect to='/corral'/>;
}