import React from 'react';
import {shallow} from 'enzyme';
import FetchService from '../services/fetchService';
import Dashboard from './Dashboard';
import {Dialog, TableHead} from '@material-ui/core'
import AddChoreModal from "./AddChoreModal";

let fetchMock = FetchService.get = jest.fn();
fetchMock.mockReturnValue(
    new Promise((resolve, reject) => resolve({tasks: [], candidates: []}))
);

describe('Dashboard', () => {
    beforeEach(jest.clearAllMocks);

    test('handles null task and candidate lists', () => {
        fetchMock.mockReturnValue(
            new Promise((resolve, reject) => resolve([]))
        );

        const dash = shallow(<Dashboard/>);
        expect(dash.find('.chore').length).toEqual(0);
        expect(dash.find('.candidate').length).toEqual(0);
    });

    test('add chore button opens modal', () => {
        const dash = shallow(<Dashboard/>);

        dash.find('#add-chore-button').simulate('click');

        expect(dash.find(AddChoreModal).prop('open')).toEqual(true);
    });


    describe('with candidate data', () => {
        let dash, rows;

        beforeEach(() => {
            rows = [
                {id: " at thing", candidate: "Friday Jeb"},
                {id: "somethign else", candidate: "Everyday Natalie"},
                {id: "nothing", candidate: "Odd Day Rob"}
            ];

            fetchMock.mockReturnValue(
                new Promise((resolve, reject) => resolve(rows))
            );

            dash = shallow(<Dashboard/>);
        });

        test('shows a list of candidates', () => {
            const pioneerTable = dash.find('PioneerTable');
            expect(pioneerTable.props().pioneers)
                .toBe(rows);
        });

    });

    describe('with task data', () => {
        let dash, rows;

        beforeEach(() => {
            rows = [
                {id: "1", task: "Move chairs"},
                {id: "2", task: "Turn off coffee pot"},
                {id: "3", task: "Stock fridge with soda"},
                {id: "4", task: "Put away dishes"},
            ]

            fetchMock.mockReturnValue(
                new Promise((resolve, reject) => resolve(rows))
            );

            dash = shallow(<Dashboard/>);
        });

        test('calls /api/chore', () => {
                expect(fetchMock).toBeCalledWith(0, "/api/chore", undefined)
            }
        )

        test('shows a list of chores', () => {
            expect(dash.find('.chore').length).toBe(rows.length);
        });

        test('Has header of Today\'s Chores', () => {
            dash = dash.dive();
            expect(dash.find(TableHead).at(0).text()).toEqual("Today\'s Chores");
        })

    });


});