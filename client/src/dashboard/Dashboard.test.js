import React from 'react';
import {shallow} from 'enzyme';
import FetchService from '../utilities/services/fetchService';
import {ChoreTable, PioneerTable} from './index';
import Dashboard from './Dashboard';
import DutyTable from '../duties/DutyTable';
import {Loading} from "./Loading";
import DutyRoster from "../duties/DutyRoster";
import ChoreCorral from "../corral/ChoreCorral";

async function waitUntil(untilFunction) {
    const start = new Date();
    while (!untilFunction() && (new Date() - start) < 300) {
        await yield25()
    }

    expect(untilFunction()).toBe(true);
}

function promiseThatDoesNotResolve() {
    return new Promise(() => ({}));
}

describe('Dashboard', () => {
    let fetchMock;

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock = FetchService.get = jest.fn();
        fetchMock.mockReturnValue(new Promise(() => ({})));
    });

    it('while loading data shows loading element and no page', () => {
        fetchMock.mockReturnValue(promiseThatDoesNotResolve());

        const dashboard = shallow(<Dashboard date={new Date()}/>);

        expect(dashboard.find(PioneerTable).length).toEqual(0);
        expect(dashboard.find(ChoreTable).length).toEqual(0);
        expect(dashboard.find(Loading).length).toEqual(1);
    });

    it('while loading pioneers shows loading element and no page', () => {
        fetchMock.mockImplementation(function (number, endpoint) {
            // noinspection JSIncompatibleTypesComparison
            if (endpoint === '/api/pioneer') {
                return promiseThatDoesNotResolve()
            } else {
                return Promise.resolve([]);
            }
        });

        const dashboard = shallow(<Dashboard date={new Date()}/>);

        expect(dashboard.find(PioneerTable).length).toEqual(0);
        expect(dashboard.find(ChoreTable).length).toEqual(0);
        expect(dashboard.find(Loading).length).toEqual(1);
    });

    it('while loading chores shows loading element and no page', () => {
        fetchMock.mockImplementation(function (number, endpoint) {
            // noinspection JSIncompatibleTypesComparison
            if (endpoint === '/api/chore') {
                return promiseThatDoesNotResolve()
            } else {
                return Promise.resolve([]);
            }
        });

        const dashboard = shallow(<Dashboard date={new Date()}/>);

        expect(dashboard.find(PioneerTable).length).toEqual(0);
        expect(dashboard.find(ChoreTable).length).toEqual(0);
        expect(dashboard.find(Loading).length).toEqual(1);
    });

    it('handles null task and pioneer lists', async function () {
        fetchMock.mockReturnValue(Promise.resolve([]));

        const dashboard = shallow(<Dashboard date={new Date()}/>);
        await waitUntil(() => dashboard.find(ChoreCorral).length !== 0);

        expect(dashboard.find(ChoreCorral).props()["pioneers"].length).toEqual(0);
        expect(dashboard.find(ChoreCorral).props()["chores"].length).toEqual(0);
    });

    describe('DutyRoster', () => {
        let dashboard;
        let dutyRoster;

        beforeEach(async () => {
            localStorage.clear();
            fetchMock.mockReturnValue(Promise.resolve([]));
            dashboard = shallow(<Dashboard date={new Date()}/>);
            await waitUntil(() => dashboard.find('#saddle-up').length !== 0);
            dashboard.find('#saddle-up').simulate('click');
            dutyRoster = dashboard.find(DutyRoster);
        });

        it('has pioneer props are equal to dashboard\'s state', () => {
            expect(dutyRoster.props()["pioneers"])
                .toEqual([])
        });

        it('has chore props are equal to dashboard\'s state', () => {
            expect(dutyRoster.props()["chores"])
                .toEqual([])
        });

        it('has a respin button that takes you back to the first view of dashboard', () => {
            dutyRoster.dive().find('#respin').simulate('click');

            expect(dashboard.find(ChoreTable).length).toEqual(1)
        })

    });

    describe('DutyRoster rendering with click', () => {
        let dashboard;

        beforeEach(async () => {
            fetchMock.mockReturnValue(Promise.resolve([]));
            dashboard = shallow(<Dashboard date={new Date()}/>);
            await waitUntil(() => dashboard.find('#saddle-up').length !== 0);
        });

        it('before click the DutyRoster are not rendered', () => {
            expect(dashboard.find(DutyRoster).length).toEqual(0)
        });

        it('after click has DutyRoster that are rendered', () => {
            dashboard.find('#saddle-up').simulate('click');
            const dutyRoster = dashboard.find(DutyRoster).dive();
            expect(dutyRoster.length).toEqual(1)
        });
    });

    describe('Date dependent DutyRoster rendering with two pioneers one chore', () => {
        let dashboard;
        let pioneers;
        let chores;

        let dateMock = Date.now = jest.fn();

        beforeEach(() => {
            localStorage.clear();
            pioneers = [
                {id: 'at thing', name: 'Friday Jeb'},
                {id: 'something else', name: 'Everyday Natalie'},
            ];

            chores = [
                {id: '1', name: 'keyboard cleaner', description: 'k'},
            ];

            fetchMock.mockReturnValueOnce(
                new Promise(resolve => resolve(pioneers))
            ).mockReturnValueOnce(new Promise(resolve => resolve(chores)));

            dashboard = shallow(<Dashboard date={new Date()}/>);
        });

        it('when saddle up clicked and Date is odd, second pioneer is assigned', () => {
            dateMock.mockReturnValue(1);
            dashboard.find('#saddle-up').simulate('click');
            const dutyRoster = dashboard.find(DutyRoster).dive();
            expect(dutyRoster.find(DutyTable).props()
                ["duties"][0].pioneer.name).toEqual('Everyday Natalie')
        });

        it('when saddle up clicked and Date is even, first pioneer is assigned', () => {
            dateMock.mockReturnValue(0);
            dashboard.find('#saddle-up').simulate('click');
            const dutyRoster = dashboard.find(DutyRoster).dive();
            expect(dutyRoster.find(DutyTable).props()
                ["duties"][0].pioneer.name).toEqual('Friday Jeb')
        })
    });

    describe('save button on DutyRoster page', () => {
        let dashboard;
        let dutyRoster;

        beforeEach(async () => {
            localStorage.clear();
            fetchMock.mockReturnValue(Promise.resolve([]));
            dashboard = shallow(<Dashboard date={new Date()}/>);
            await waitUntil(() => dashboard.find('#saddle-up').length !== 0);
            dashboard.find('#saddle-up').simulate('click');
            dutyRoster = dashboard.find(DutyRoster).dive();
        });

        it('When not clicked thing with id save does not exist', () => {
            expect(dutyRoster.find('#saved-confirmation').length).toEqual(0)
        });

        it('When clicked has text Save Confirmed! on the page', () => {
            dutyRoster.find('#save').simulate('click');
            dutyRoster = dashboard.find(DutyRoster).dive();
            expect(dutyRoster.find('#saved-confirmation').text()).toEqual('Save Confirmed!')
        });

        it('When clicked does not have save button', () => {
            dutyRoster.find('#save').simulate('click');
            dutyRoster = dashboard.find(DutyRoster).dive();
            expect(dutyRoster.find('#respin').length).toEqual(1);
            expect(dutyRoster.find('#save').length).toEqual(0)
        })
    });

    describe('when a duty roster is saved', () => {
        let dashboard;

        beforeEach(async () => {
            localStorage.clear();
            fetchMock.mockReturnValue(Promise.resolve([]));
            dashboard = shallow(<Dashboard date={new Date()}/>);
            await waitUntil(() => dashboard.find('#saddle-up').length !== 0);
            dashboard.find('#saddle-up').simulate('click');
        });

        it('is shared with DutyRoster', () => {
            const expectedDutyRoster = [{name: 'jack', chore: 'jest'}];
            dashboard.find(DutyRoster).props()["onSave"](expectedDutyRoster);
            expect(dashboard.find(DutyRoster).props().dutyRoster).toEqual(expectedDutyRoster);

        })
    });

});

function yield25() {
    return new Promise((resolve) => {
        setInterval(resolve, 25)
    });
}