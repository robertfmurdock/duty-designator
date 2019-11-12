import React from "react";
import {shallow} from "enzyme";
import DutyGrid from "./DutyGrid";
import {Card, CardHeader} from "@material-ui/core";
import DutyCard from "./DutyCard";

describe('Duty Grid', () => {
    let twoDuties, threeDuties, twoDutyGrid, threeDutyGrid;

    beforeEach( () => {
        const appleDuty = {
            pioneer: {name: "Stebe", id: "1"},
            chore: {name: "makin' apples", id: "a", description: "Yup", title: "the boss"}
        };

        const orangeDuty = {
            pioneer: {name: "Joey", id: "2"},
            chore: {name: "squeezin' oranges", id: "b", description: "Nope", title: "the exploited worker"}
        };

        const avocadoDuty = {
            pioneer: {name: "Ava", id: "12"},
            chore: {name: "pittin'", id: "ab", description: "pullin'", title: "pitmaster"}
        };

        twoDuties = [appleDuty, orangeDuty];
        threeDuties = [appleDuty, avocadoDuty, orangeDuty];
        twoDutyGrid = shallow(<DutyGrid duties={twoDuties}/>);
        threeDutyGrid = shallow(<DutyGrid duties={threeDuties}/>);
    });

    it('Two duty grid has two duty card elements', () => {
        expect(twoDutyGrid.find(DutyCard).length).toBe(twoDuties.length)
    });

    it('when passed two duties has two cards with passed duties', () => {
        const dutyGridDuties =  twoDutyGrid.find(DutyCard).map(
            dutyCard => dutyCard.props().duty
        );
        expect(dutyGridDuties).toEqual(twoDuties)
    });
    it('when passed three duties has three cards with passed duties', () => {
        const dutyGridDuties =  threeDutyGrid.find(DutyCard).map(
            dutyCard => dutyCard.props().duty
        );
        expect(dutyGridDuties).toEqual(threeDuties)
    });


});