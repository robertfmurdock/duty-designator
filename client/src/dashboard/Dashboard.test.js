import React from 'react';
import {shallow} from 'enzyme';
import FetchService from '../utilities/services/fetchService';
import {AddChoreModal, ChoreTable, PioneerTable} from './index';
import Dashboard from './Dashboard';
import Results from '../results/Results';
import DutyTable from '../duties/DutyTable';
import Typography from "@material-ui/core/Typography";

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

    beforeEach(jest.clearAllMocks);

    beforeEach(() => {
        fetchMock = FetchService.get = jest.fn();
        fetchMock.mockReturnValue(new Promise(() => ({})));
    });

    it('while loading data shows loading element and no page', () => {
        fetchMock.mockReturnValue(promiseThatDoesNotResolve());

        const dashboard = shallow(<Dashboard/>);

        expect(dashboard.find(PioneerTable).length).toEqual(0);
        expect(dashboard.find(ChoreTable).length).toEqual(0);
        const typographyNode = dashboard.find(Typography);
        expect(typographyNode.length).toEqual(1);
        expect(typographyNode.text()).toEqual("Loadin', pardners");
    });

    it('while loading pioneers shows loading element and no page', () => {
        fetchMock.mockImplementation(function (number, endpoint) {
            if (endpoint === '/api/candidate') {
                return promiseThatDoesNotResolve()
            } else {
                return Promise.resolve([]);
            }
        });

        const dashboard = shallow(<Dashboard/>);

        expect(dashboard.find(PioneerTable).length).toEqual(0);
        expect(dashboard.find(ChoreTable).length).toEqual(0);
        const typographyNode = dashboard.find(Typography);
        expect(typographyNode.length).toEqual(1);
        expect(typographyNode.text()).toEqual("Loadin', pardners");
    });

    it('while loading chores shows loading element and no page', () => {
        fetchMock.mockImplementation(function (number, endpoint) {
            if (endpoint === '/api/chore') {
                return promiseThatDoesNotResolve()
            } else {
                return Promise.resolve([]);
            }
        });

        const dashboard = shallow(<Dashboard/>);

        expect(dashboard.find(PioneerTable).length).toEqual(0);
        expect(dashboard.find(ChoreTable).length).toEqual(0);
        const typographyNode = dashboard.find(Typography);
        expect(typographyNode.length).toEqual(1);
        expect(typographyNode.text()).toEqual("Loadin', pardners");
    });

    it('handles null task and pioneer lists', async function () {
        fetchMock.mockReturnValue(Promise.resolve([]));

        const dashboard = shallow(<Dashboard/>);
        await waitUntil(() => dashboard.find(PioneerTable).length !== 0);

        expect(dashboard.find(PioneerTable).props().pioneers.length).toEqual(0);
        expect(dashboard.find(ChoreTable).props().chores.length).toEqual(0);
    });

    it('ChoreTable can open modal', async () => {
        fetchMock.mockReturnValue(Promise.resolve([]));
        const dashboard = shallow(<Dashboard/>);
        await waitUntil(() => dashboard.find(ChoreTable).length !== 0);

        dashboard.find(ChoreTable)
            .props()
            .addChoreHandler();

        expect(dashboard.find(AddChoreModal).prop('open')).toEqual(true);
    });

    describe('with pioneer data', () => {
        let dashboard, pioneers;

        beforeEach(() => {
            pioneers = [
                {id: ' at thing', name: 'Friday Jeb'},
                {id: 'something else', name: 'Everyday Natalie'},
                {id: 'nothing', name: 'Odd Day Rob'}
            ];

            fetchMock.mockReturnValue(
                new Promise(resolve => resolve(pioneers))
            );

            dashboard = shallow(<Dashboard/>);
        });

        it('shows a list of pioneers', () => {
            const pioneerTable = dashboard.find(PioneerTable);
            expect(pioneerTable.props().pioneers).toBe(pioneers);
        });

        it('When PioneerTable remove last Pioneer, last Pioneer row is removed', () => {
            let pioneerToRemove = pioneers[2];
            simulateRemovePioneer(pioneerToRemove);

            expect(dashboard.find(PioneerTable).props().pioneers).toEqual(pioneers.slice(0, 2))
        });

        it('When PioneerTable remove middle Pioneer, middle Pioneer row is removed', () => {
            let pioneerToRemove = pioneers[1];
            simulateRemovePioneer(pioneerToRemove);

            const expectedRemaining = [pioneers[0], pioneers[2]];
            expect(dashboard.find(PioneerTable).props().pioneers).toEqual(expectedRemaining)
        });

        it('Reset button presents default page', async () => {
            let pioneerToRemove = pioneers[0];
            simulateRemovePioneer(pioneerToRemove);

            dashboard.find('#reset-button').simulate('click');

            await waitUntil(()=> dashboard.find(PioneerTable).length !== 0);

            expect(dashboard.find(PioneerTable).props().pioneers).toEqual(pioneers)
        });

        function simulateRemovePioneer(pioneerToRemove) {
            let removeFunction = dashboard.find('PioneerTable').props().onRemove;
            removeFunction(pioneerToRemove)
        }
    });

    describe('with chore data', () => {
        let dashboard, chores;

        beforeEach(() => {
            chores = [
                {id: '1', name: 'Move chairs'},
                {id: '2', name: 'Turn off coffee pot'},
                {id: '3', name: 'Stock fridge with soda'},
                {id: '4', name: 'Put away dishes'},
            ];

            fetchMock.mockReturnValue(new Promise(resolve => resolve(chores)));
            dashboard = shallow(<Dashboard/>);
        });

        it('calls /api/chore', () => {
            expect(fetchMock).toBeCalledWith(0, '/api/chore', undefined)
        });

        it('will send chores to chore table', () => {
            const chores = dashboard.find(ChoreTable).props().chores;
            expect(chores).toEqual(chores);
        });

        it('When ChoreTable remove a chore, the chore entry is removed', () => {
            const choreToRemove = chores[1];
            const expectedRemaining = [chores[0], chores[2], chores[3]];
            simulateRemoveChore(choreToRemove);

            expect(dashboard.find(ChoreTable).props().chores).toEqual(expectedRemaining)
        });

        it('When AddChoreModal adds a chore, the chore entry is added to the list', () => {
            const newChore = {id: '5', name: 'Super Easy Chore', description: 'Its so easy'};
            const expectedChores = [...chores, newChore];
            dashboard.find(AddChoreModal).props().addChore(newChore.name, newChore.description);

            expect(dashboard.find(ChoreTable).props().chores).toEqual(expectedChores)
        });

        function simulateRemoveChore(pioneerToRemove) {
            let removeFunction = dashboard.find(ChoreTable).props().onRemove;
            removeFunction(pioneerToRemove)
        }
    });

    describe('results', () => {
        let dashboard;

        beforeEach(async () => {
            localStorage.clear();
            fetchMock.mockReturnValue(Promise.resolve([]));
            dashboard = shallow(<Dashboard/>);
            await waitUntil(() => dashboard.find('#saddle-up').length !== 0);
            dashboard.find('#saddle-up').simulate('click');
        });

        it('has pioneer props are equal to dashboard\'s state', () => {
            expect(dashboard.find(Results).props().pioneers)
                .toEqual([])
        });

        it('has chore props are equal to dashboard\'s state', () => {
            expect(dashboard.find(Results).props().chores)
                .toEqual([])
        });

        it('has a respin button that takes you back to the first view of dashboard', () => {
            dashboard.find('#respin').simulate('click');
            expect(dashboard.find(ChoreTable).length).toEqual(1)
        })

    });

    describe('results rendering with click', () => {
        let dashboard;

        beforeEach(async () => {
            fetchMock.mockReturnValue(Promise.resolve([]));
            dashboard = shallow(<Dashboard/>);
            await waitUntil(() => dashboard.find('#saddle-up').length !== 0);
        });

        it('before click the results are not rendered', () => {
            expect(dashboard.find(Results).length).toEqual(0)
        });

        it('after click has results that are rendered', () => {
            dashboard.find('#saddle-up').simulate('click');
            expect(dashboard.find(Results).length).toEqual(1)
        });
    });

    describe('Date dependent results rendering with two pioneers one chore', () => {
        let dashboard;
        let pioneers;
        let chores;

        let dateMock = Date.now = jest.fn();

        beforeEach(() => {
            pioneers = [
                {id: 'at thing', name: 'Friday Jeb'},
                {id: 'something else', name: 'Everyday Natalie'},
            ];

            chores = [
                {id: '1', name: 'keyboard kleaner', description: 'k'},
            ];

            fetchMock.mockReturnValueOnce(
                new Promise(resolve => resolve(pioneers))
            ).mockReturnValueOnce(new Promise(resolve => resolve(chores)));

            dashboard = shallow(<Dashboard/>);
        });

        it('when saddle up clicked and Date is odd, second pioneer is assigned', () => {
            dateMock.mockReturnValue(1)
            dashboard.find('#saddle-up').simulate('click')
            expect(dashboard.find(Results).dive().find(DutyTable).props()
                .duties[0].pioneer.name).toEqual('Everyday Natalie')
        })

        it('when saddle up clicked and Date is even, first pioneer is assigned', () => {
            dateMock.mockReturnValue(0)
            dashboard.find('#saddle-up').simulate('click')
            expect(dashboard.find(Results).dive().find(DutyTable).props()
                .duties[0].pioneer.name).toEqual('Friday Jeb')
        })
    })

    describe('save button on results page', () => {
        let dashboard;

        beforeEach(async () => {
            localStorage.clear();
            fetchMock.mockReturnValue(Promise.resolve([]));
            dashboard = shallow(<Dashboard/>);
            await waitUntil(() => dashboard.find('#saddle-up').length !== 0);
            dashboard.find('#saddle-up').simulate('click');
        });

        it('When not clicked thing with id save does not exist', () => {
            expect(dashboard.find('#saved-confirmation').length).toEqual(0)
        });

        it('When clicked has text Save Confirmed! on the page', () => {
            dashboard.find('#save').simulate('click');
            expect(dashboard.find('#saved-confirmation').text()).toEqual('Save Confirmed!')
        });

        it('When clicked does not have save button', () => {
            dashboard.find('#save').simulate('click');

            expect(dashboard.find('#respin').length).toEqual(1);
            expect(dashboard.find('#save').length).toEqual(0)
        })
    })

});

function yield25() {
    return new Promise((resolve) => {
        setInterval(resolve, 25)
    });
}