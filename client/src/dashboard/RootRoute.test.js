import React from 'react';
import {shallow} from 'enzyme';
import RootRoute from './RootRoute';
import {Redirect} from "react-router-dom";

describe('RootRoute', () => {
    it('given no duty roster, redirects the chore corral', () => {
        let dashboard = shallow(<RootRoute dutyRoster={null}/>);

        const redirect = dashboard.find(Redirect);
        expect(redirect.length).toEqual(1);
        expect(redirect.props()['to']).toEqual('/corral');
    });

    it('given duty roster, it redirects duty roster', () => {
        let dashboard = shallow(<RootRoute dutyRoster={7}/>);

        const redirect = dashboard.find(Redirect);
        expect(redirect.length).toEqual(1);
        expect(redirect.props()['to']).toEqual('/roster');
    });
});