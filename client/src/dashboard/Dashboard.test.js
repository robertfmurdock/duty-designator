import React from 'react';
import {shallow} from 'enzyme';
import FetchService from '../services/fetchService';
import Dashboard from './Dashboard';
import {TableHead} from '@material-ui/core'
import AddChoreModal from "./AddChoreModal";
import PioneerTable from "./PioneerTable";
import ChoreTable from "./ChoreTable";


let fetchMock = FetchService.get = jest.fn();
fetchMock.mockReturnValue(
    new Promise((resolve, reject) => resolve({tasks: [], candidates: []}))
);

async function waitUntil(hasAllPioneers) {
    const start = new Date();
    while (!hasAllPioneers() && (new Date() - start) < 300) {
        await yield25()
    }
}

describe('Dashboard', () => {
    beforeEach(jest.clearAllMocks);

    test('handles null task and candidate lists', () => {
        fetchMock.mockReturnValue(
            new Promise((resolve, reject) => resolve([]))
        );

        const dashboard = shallow(<Dashboard/>);
        expect(dashboard.find('.chore').length).toEqual(0);
        expect(dashboard.find('.candidate').length).toEqual(0);
    });

    test('ChoreTable can open modal', () => {
        const dashboard = shallow(<Dashboard/>);

        dashboard.find(ChoreTable)
            .props()
            .addChoreHandler();

        expect(dashboard.find(AddChoreModal).prop('open')).toEqual(true);
    });

    describe('with candidate data', () => {
        let dashboard, rows;

        beforeEach(() => {
            rows = [
                {id: " at thing", candidate: "Friday Jeb"},
                {id: "somethign else", candidate: "Everyday Natalie"},
                {id: "nothing", candidate: "Odd Day Rob"}
            ];

            fetchMock.mockReturnValue(
                new Promise((resolve, reject) => resolve(rows))
            );

            dashboard = shallow(<Dashboard/>);
        });

        test('shows a list of candidates', () => {
            const pioneerTable = dashboard.find('PioneerTable');
            expect(pioneerTable.props().pioneers)
                .toBe(rows);
        });

        test('When PioneerTable remove last Pioneer, last Pioneer row is removed', () => {
            let pioneerToRemove = rows[2]
            simulateRemovePioneer(pioneerToRemove);
            dashboard.update()

            expect(dashboard.find(PioneerTable).props().pioneers).
                toEqual(rows.slice(0,2))
        })


        test('When PioneerTable remove middle Pioneer, middle Pioneer row is removed', () => {
            let pioneerToRemove = rows[1]
            simulateRemovePioneer(pioneerToRemove);
            dashboard.update()

            const expectedRemaining = [rows[0], rows[2]]

            expect(dashboard.find(PioneerTable).props().pioneers).
                toEqual(expectedRemaining)
        })

        test('Reset button presents default page', async () => {
            let pioneerToRemove = rows[0]
            simulateRemovePioneer(pioneerToRemove);
            dashboard.update()

            dashboard.find('#reset-button').simulate('click')

            await waitUntil(() => {
                dashboard.update();
                return dashboard.find(PioneerTable).props().pioneers === rows;
            });

            expect(dashboard.find(PioneerTable).props().pioneers).
                toEqual(rows)
        });

        function simulateRemovePioneer(pioneerToRemove) {
            let removeFunction = dashboard.find('PioneerTable').props().onRemove;
            removeFunction(pioneerToRemove)
        }
    });

    describe('with task data', () => {
        let dashboard, chores;

        beforeEach(() => {
            chores = [
                {id: "1", task: "Move chairs"},
                {id: "2", task: "Turn off coffee pot"},
                {id: "3", task: "Stock fridge with soda"},
                {id: "4", task: "Put away dishes"},
            ];

            fetchMock.mockReturnValue(
                new Promise(resolve => resolve(chores))
            );

            dashboard = shallow(<Dashboard/>);
        });

        test('calls /api/chore', () => {
                expect(fetchMock).toBeCalledWith(0, "/api/chore", undefined)
            }
        );

        test('will send chores to chore table', () => {
            const chores = dashboard.find(ChoreTable).props().chores;
            expect(chores).toEqual(chores);
        })

    });


});

function yield25() {
    return new Promise((resolve, reject) => {
        setInterval(resolve, 25)
    });
}