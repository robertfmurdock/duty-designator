import React from 'react';
import {shallow} from 'enzyme';
import FetchService from '../services/fetchService';
import Dashboard from './Dashboard';
import {TableHead} from '@material-ui/core'

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
        expect(dash.find('.task').length).toEqual(0);
        expect(dash.find('.candidate').length).toEqual(0);
    });

    describe('with candidate data', () => {
        let dash, rows;

        beforeEach(() => {
            rows = [
                {id:" at thing", candidate: "Friday Jeb"},
                {id: "somethign else", candidate: "Everyday Natalie"},
                {id: "nothing", candidate: "Odd Day Rob"}
            ]

            fetchMock.mockReturnValue(
                new Promise((resolve, reject) => resolve(rows))
            );

            dash = shallow(<Dashboard/>);
        });

        test('shows a list of candidates', () => {
            expect(dash.find('.candidate').length).toBe(rows.length);
        });

        test('Has header of Today\'s Pioneers', () => {
            dash = dash.dive();
            expect(dash.find(TableHead).at(0).text()).toEqual("Today\'s Pioneers");
        })

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
            expect(dash.find(TableHead).at(1).text()).toEqual("Today\'s Chores");
        })
        

    });


});