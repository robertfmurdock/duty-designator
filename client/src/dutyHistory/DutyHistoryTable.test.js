import React from 'react';
import {shallow} from 'enzyme';
import DutyHistoryTable from "./DutyHistoryTable";

describe('DutyHistoryTable', () => {
    const pioneer = {name: "Davey Doo", id: "does duties"};

    it('renders without crashing', () => {
        let table = shallow(<DutyHistoryTable pioneer={pioneer} choreCounts={[]}/>);
        expect(table.find('.pioneer-name').length).toEqual(1);
    });

    it('renders pioneer name', () => {
        let table = shallow(<DutyHistoryTable pioneer={pioneer} choreCounts={[]}/>);
        expect(table.find('.pioneer-name').text()).toBe(pioneer.name);
    });

    it('renders no chores message if no chore counts are passed', () => {
        let table = shallow(<DutyHistoryTable pioneer={pioneer} choreCounts={[]}/>);

        expect(table.find('.lazy-pioneer-msg').length).toEqual(1);
        expect(table.find('.chore-count-row').length).toEqual(0);
    });

    it('renders chore count rows for each chore count element', () => {
        const dishes = {name: "Those Dish Things", id: "42", count: "1"};
        const dj = {name: "Saloon DJ", id: "99", count: "4"};
        let choreCounts = [dishes, dj];

        let table = shallow(<DutyHistoryTable pioneer={pioneer} choreCounts={choreCounts}/>);

        expect(table.find('.chore-count-row').length).toEqual(2);
        expect(table.find('.chore-name').at(0).text()).toBe(dishes.name);
        expect(table.find('.chore-count').at(0).text()).toBe(dishes.count);
        expect(table.find('.chore-name').at(1).text()).toBe(dj.name);
        expect(table.find('.chore-count').at(1).text()).toBe(dj.count);
    });
});