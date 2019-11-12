import React from "react";
import {ReactComponent as WheelSvg} from "./wheel/wheel.svg";
import './loading.css';
import {Container} from "@material-ui/core";

const loading = {
    container: {
        padding: 16,
        textAlign: 'center'
    },
    wheel: {
        width: 100,
        height: 100,
        animation: 'rotate 2s linear infinite'
    }
};

export function Loading() {
    return <Container fixed style={loading.container}>
        <WheelSvg style={loading.wheel}/>
    </Container>
}