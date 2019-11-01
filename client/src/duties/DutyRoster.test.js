import React from "react";
import {shallow} from 'enzyme';
import DutyRoster from "./DutyRoster";
import DutyTable from "./DutyTable";
import {format} from 'date-fns';
import {loadStuff} from "../utilities/services/localStorageService";

describe('DutyRoster', function () {
    beforeEach(() => {
        localStorage.clear();
    });

    it('will persist new duty roster', function () {
        const pioneer = {name: "jack"};
        const chore = {name: "jest"};
        const date = format(new Date(), "MM/dd/yyyy");
        const dutyRoster = shallow(<DutyRoster pioneers={[pioneer]} chores={[chore]}/>);

        dutyRoster.find('#save').simulate('click');

        expect(loadStuff(date).dutyRoster).toStrictEqual([{pioneer, chore}]);
    });

    test('given no chores returns nothing', () => {
        const dutyRoster = shallow(<DutyRoster chores={[]} pioneers={[]}/>)
        expect(dutyRoster.find(DutyTable).props().duties).toEqual([]);
    });

    test('given associator that returns 7 get duties of 7', () => {
        const pioneer = {name: "jack"};
        const chore = {name: "jest"};
        const dutyRoster = shallow(<DutyRoster pioneers={[pioneer]} chores={[chore]}/>);

        expect(dutyRoster.find(DutyTable).props().duties).toEqual([{pioneer, chore}]);
    });

    test('given associate and one pioneer and one chore get one duty', () => {
        const pioneers = ["Pioneer Jeb"];
        const chores = ["codin"];

        const results = shallow(<DutyRoster chores={chores} pioneers={pioneers}/>)

        expect(results.find(DutyTable).props().duties.length).toEqual(1);
    });

    test('given no duty roster is saved, show saved button', () => {
        const dutyRoster = shallow(<DutyRoster chores={["codin"]} pioneers={["Pioneer Jeb"]}/>)
        expect(dutyRoster.find('#save').length).toEqual(1);
    });

    test('given a duty roster is saved, do not show saved button', () => {
        localStorage.setItem(format(new Date(), 'MM/dd/yyyy'), JSON.stringify({dutyRoster: 7}));
        const dutyRoster = shallow(<DutyRoster chores={["codin"]} pioneers={["Pioneer Jeb"]}/>);

        expect(dutyRoster.find('#save').length).toEqual(0);
        expect(dutyRoster.find('#saved-confirmation').length).toEqual(1);
    });
});