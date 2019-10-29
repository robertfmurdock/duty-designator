import React from "react";
import TodaysWagonWheel from "./TodaysWagonWheel";
import {shallow} from "enzyme";
import {Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

describe('TodaysWagonWheel', () => {

    it('will render the date nicely', () => {
        const date = new Date(2020, 10, 3, 12, 34, 43);

        let wheelWrapper = shallow(<TodaysWagonWheel date={date}/>);

        expect(wheelWrapper.find(Typography).at(1).text())
            .toBe('11/03/2020');
    });

    it('will supply a back button with a route to the day before the provided date', () => {
        const date = new Date(2020, 10, 3, 12, 34, 43);
        let wheelWrapper = shallow(<TodaysWagonWheel date={date}/>);
        expect(wheelWrapper.find(Link).props().to).toBe("/11022020");
    });
});