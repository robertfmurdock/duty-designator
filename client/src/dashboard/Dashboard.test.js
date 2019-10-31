import React from 'react';
import {shallow} from 'enzyme';
import Dashboard from './Dashboard';
import ChoreCorral from "../corral/ChoreCorral";
import HistoricalRoster from "../duties/HistoricalRoster";

describe('Dashboard', () => {
    it('renders the chore corral when there is no duty roster', () => {
        localStorage.clear();
        let dashboard = shallow(<Dashboard date={new Date()}/>);

        expect(dashboard.find(ChoreCorral).length).toEqual(1);
        expect(dashboard.find(HistoricalRoster).length).toEqual(0);
    });

    it('renders historical roster given a duty roster exists in local storage', () => {
        localStorage.setItem("10/10/2010", JSON.stringify({dutyRoster: 7}));
        let dashboard = shallow(<Dashboard date={new Date(2010, 9, 10)}/>);
        expect(dashboard.find(HistoricalRoster).length).toEqual(1);
        expect(dashboard.find(ChoreCorral).length).toEqual(0);
    });
});