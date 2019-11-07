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
        const history = {push: jest.fn()};
        const dutyRoster = shallow(<DutyRoster pioneers={[pioneer]} chores={[chore]} history={history}/>);

        dutyRoster.find('#save').simulate('click');

        expect(loadStuff(date).dutyRoster).toStrictEqual([{pioneer, chore}]);
    });

    test('given no chores returns nothing', () => {
        const dutyRoster = shallow(<DutyRoster chores={[]} pioneers={[]}/>);
        expect(dutyRoster.find(DutyTable).props()['duties']).toEqual([]);
    });

    test('when given single pioneer and single chore will make single duty with them', () => {
        const pioneer = {name: "jack"};
        const chore = {name: "jest"};
        const dutyRoster = shallow(<DutyRoster pioneers={[pioneer]} chores={[chore]}/>);

        expect(dutyRoster.find(DutyTable).props()['duties']).toEqual([{pioneer, chore}]);
    });

    test('given associate and one pioneer and one chore get one duty', () => {
        const pioneers = ["Pioneer Jeb"];
        const chores = ["codin"];

        const results = shallow(<DutyRoster chores={chores} pioneers={pioneers}/>);

        expect(results.find(DutyTable).props().duties.length).toEqual(1);
    });

    test('given no duty roster is saved, show saved button', () => {
        const dutyRoster = shallow(<DutyRoster chores={["codin"]} pioneers={["Pioneer Jeb"]}/>);
        expect(dutyRoster.find('#save').length).toEqual(1);
    });

    test('given a duty roster is saved, do not show saved button', () => {
        const pioneer = {name: "jack"};
        const chore = {name: "jest"};
        const date = format(new Date(), "MM/dd/yyyy");
        localStorage.setItem(date, JSON.stringify({dutyRoster: [{pioneer, chore}]}));

        const dutyRoster = shallow(<DutyRoster/>);

        expect(dutyRoster.find('#save').length).toEqual(0);
        expect(dutyRoster.find('#saved-confirmation').length).toEqual(1);
    });

    test('respin will redirect to the corral', () => {
        const pioneer = {name: "jack"};
        const chore = {name: "jest"};
        const date = format(new Date(), "MM/dd/yyyy");
        localStorage.setItem(date, JSON.stringify({dutyRoster: [{pioneer, chore}]}));

        const pushSpy = jest.fn();
        const dutyRoster = shallow(<DutyRoster history={{push: pushSpy}}/>);
        dutyRoster.find("#respin").simulate("click");
        expect(pushSpy.mock.calls.length).toBe(1);
        expect(pushSpy.mock.calls[0][0]).toEqual('/corral');
    });
});