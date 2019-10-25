import React from 'react';
import { shallow } from 'enzyme';
import FetchService from '../utilities/services/fetchService';
import { AddChoreModal, ChoreTable, PioneerTable } from './index';
import Dashboard from './Dashboard';
import Results from '../results/Results';

// console.warn = jest.fn();
let fetchMock = FetchService.get = jest.fn();

async function waitUntil(hasAllPioneers) {
    const start = new Date();
    while (!hasAllPioneers() && (new Date() - start) < 300) {
        await yield25()
    }
}

describe('Dashboard', () => {
    beforeEach(jest.clearAllMocks);

    test("while loading data shows no rows", () => {
        fetchMock.mockReturnValue(new Promise(() => ({})));

        const dashboard = shallow(<Dashboard/>);
        expect(dashboard.find(PioneerTable).props().pioneers.length).toEqual(0);
        expect(dashboard.find(ChoreTable).props().chores.length).toEqual(0);
    });

    test('handles null task and pioneer lists', () => {
        fetchMock.mockReturnValue(new Promise((resolve) => resolve([])));

        const dashboard = shallow(<Dashboard/>);
        expect(dashboard.find(PioneerTable).props().pioneers.length).toEqual(0);
        expect(dashboard.find(ChoreTable).props().chores.length).toEqual(0);
    });

    test('ChoreTable can open modal', () => {
        const dashboard = shallow(<Dashboard/>);

        dashboard.find(ChoreTable)
            .props()
            .addChoreHandler();

        expect(dashboard.find(AddChoreModal).prop('open')).toEqual(true);
    });

    describe('with pioneer data', () => {
        let dashboard, pioneers;

        beforeEach(() => {
            pioneers = [
                {id: " at thing", name: "Friday Jeb"},
                {id: "something else", name: "Everyday Natalie"},
                {id: "nothing", name: "Odd Day Rob"}
            ];

            fetchMock.mockReturnValue(
                new Promise(resolve => resolve(pioneers))
            );

            dashboard = shallow(<Dashboard/>);
        });

        test('shows a list of pioneers', () => {
            const pioneerTable = dashboard.find(PioneerTable);
            expect(pioneerTable.props().pioneers).toBe(pioneers);
        });

        test('When PioneerTable remove last Pioneer, last Pioneer row is removed', () => {
            let pioneerToRemove = pioneers[2];
            simulateRemovePioneer(pioneerToRemove);

            expect(dashboard.find(PioneerTable).props().pioneers).toEqual(pioneers.slice(0, 2))
        });

        test('When PioneerTable remove middle Pioneer, middle Pioneer row is removed', () => {
            let pioneerToRemove = pioneers[1];
            simulateRemovePioneer(pioneerToRemove);

            const expectedRemaining = [pioneers[0], pioneers[2]];
            expect(dashboard.find(PioneerTable).props().pioneers).toEqual(expectedRemaining)
        });

        test('Reset button presents default page', async () => {
            let pioneerToRemove = pioneers[0];
            simulateRemovePioneer(pioneerToRemove);

            dashboard.find('#reset-button').simulate('click');

            await waitUntil(() => {
                dashboard.update();
                return dashboard.find(PioneerTable).props().pioneers === pioneers;
            });

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
                {id: "1", name: "Move chairs"},
                {id: "2", name: "Turn off coffee pot"},
                {id: "3", name: "Stock fridge with soda"},
                {id: "4", name: "Put away dishes"},
            ];

            fetchMock.mockReturnValue(new Promise(resolve => resolve(chores)));
            dashboard = shallow(<Dashboard/>);
        });

        it('calls /api/chore', () => {
            expect(fetchMock).toBeCalledWith(0, "/api/chore", undefined)
        });

        it('will send chores to chore table', () => {
            const chores = dashboard.find(ChoreTable).props().chores;
            expect(chores).toEqual(chores);
        });

        test('When ChoreTable remove a chore, the chore entry is removed', () => {
            const choreToRemove = chores[1];
            const expectedRemaining = [chores[0], chores[2], chores[3]];
            simulateRemoveChore(choreToRemove);

            expect(dashboard.find(ChoreTable).props().chores).toEqual(expectedRemaining)
        });

        test('When AddChoreModal adds a chore, the chore entry is added to the list', () => {
            const newChore = {id: "5", name: "Super Easy Chore", description: "Its so easy"};
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

        beforeEach(() => {
            dashboard = shallow(<Dashboard />);
            dashboard.setState({hasBeenClicked: true})

        });

        it('has pioneer props are equal to dashboard\'s state', () => {
            expect(dashboard.find(Results).props().pioneers)
                .toBe(dashboard.state().pioneers)
        })

        it('has chore props are equal to dashboard\'s state', () => {
            expect(dashboard.find(Results).props().chores)
                .toBe(dashboard.state().chores)
        })

        it('has a respin button that takes you back to the first view of dashboard', () => {
            dashboard.setState({hasBeenClicked: true})
            dashboard.find('#respin').simulate('click')
            expect(dashboard.state().hasBeenClicked).toEqual(false)
        })


    });

    describe('results rendering with click', () => {
        let dashboard;

        beforeEach(() => {
            dashboard = shallow(<Dashboard />);
        });

        it('before click the results are not rendered', () => {
            expect(dashboard.find(Results).length).toEqual(0)
        });

        it('after click has results that are rendered', () => {
            dashboard.setState({hasBeenClicked: true})
            expect(dashboard.find(Results).length).toEqual(1)
        });

        it('saddle-up button changes hasBeenClicked state', () => {
            dashboard.find('#saddle-up').simulate('click')
            expect(dashboard.state().hasBeenClicked).toEqual(true)
        })
    });

    describe('save button on results page', () => {
        let dashboard;

        beforeEach(() => {
            localStorage.clear();
            dashboard = shallow(<Dashboard />);
            dashboard.setState({hasBeenClicked: true})
            dashboard.setState({assignmentsSaved: false})

        });

        it('When not clicked thing with id save does not exist', () => {
            expect(dashboard.find('#saved-confirmation').length).toEqual(0)
        });

        it('When clicked has text Save Confirmed! on the page', () => {
            dashboard.find('#save').simulate('click')
            expect(dashboard.find('#saved-confirmation').text()).toEqual('Save Confirmed!')
        });

        it('When clicked does not have save button', () => {
            dashboard.find('#save').simulate('click')

            expect(dashboard.find('#respin').length).toEqual(1)
            expect(dashboard.find('#save').length).toEqual(0)
        })

    })

});






function yield25() {
    return new Promise((resolve) => {
        setInterval(resolve, 25)
    });
}