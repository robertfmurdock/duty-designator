import React from "react";
import TodaysWagonWheel from "./TodaysWagonWheel";
import {shallow} from "enzyme";
import {Typography} from "@material-ui/core";

describe('TodaysWagonWheel', () => {

    it('will render the date nicely', () => {
        const date = new Date(2020, 10, 3, 12, 34, 43);

        let wheelWrapper = shallow(<TodaysWagonWheel date={date}/>);

        expect(wheelWrapper.find(Typography).at(1).text())
            .toBe('11/03/2020')
    });
});