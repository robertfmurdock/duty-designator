import React from 'react';
import {shallow} from 'enzyme';
import ChoreHistoryTable from "./ChoreHistoryTable";

describe('ChoreHistoryTable', () => {
    it('renders without crashing', () => {
        let pioneer = {name: "Davey Doo", id: "does duties"};
        let table = shallow(<ChoreHistoryTable pioneer={pioneer} choreCounts={[]}/>);

        expect(table.find('.pioneer-name').length).toEqual(1);
    });

    it('renders pioneer name', () => {
        let pioneer = {name: "Davey Doo", id: "does duties"};
        let table = shallow(<ChoreHistoryTable pioneer={pioneer} choreCounts={[]}/>);

        expect(table.find('.pioneer-name').text()).toBe(pioneer.name);
    });

    it('renders chore count rows for each chore count element', () => {
        let pioneer = {name: "Davey Doo", id: "does duties"};
        const dishes = {name: "Those Dish Things", id: "42", count: "1"};
        const dj = {name: "Saloon DJ", id: "99", count: "4"};
        let choreCounts = [dishes, dj];

        let table = shallow(<ChoreHistoryTable pioneer={pioneer} choreCounts={choreCounts}/>);

        expect(table.find('.chore-name').at(0).text()).toBe(dishes.name);
        expect(table.find('.chore-count').at(0).text()).toBe(dishes.count);
        expect(table.find('.chore-name').at(1).text()).toBe(dj.name);
        expect(table.find('.chore-count').at(1).text()).toBe(dj.count);
    });
});