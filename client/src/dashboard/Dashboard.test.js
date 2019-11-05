import React from 'react';
import {shallow} from 'enzyme';
import Dashboard from './Dashboard';
import {Redirect} from "react-router-dom";

describe('Dashboard', () => {
    it('renders the chore corral when there is no duty roster', () => {
        localStorage.clear();
        let dashboard = shallow(<Dashboard date={new Date()}/>);

        const redirect = dashboard.find(Redirect);
        expect(redirect.length).toEqual(1);
        expect(redirect.props()['to']).toEqual('/corral');
    });

    it('renders historical roster given a duty roster exists in local storage', () => {
        localStorage.setItem("10/10/2010", JSON.stringify({dutyRoster: 7}));
        let dashboard = shallow(<Dashboard date={new Date(2010, 9, 10)}/>);
        const redirect = dashboard.find(Redirect);
        expect(redirect.length).toEqual(1);
        expect(redirect.props()['to']).toEqual('/roster');
    });
});