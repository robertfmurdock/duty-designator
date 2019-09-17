import React from 'react';
import { shallow } from 'enzyme';
import FetchService from '../services/fetchService';
import Dashboard from './Dashboard';

let fetchMock = FetchService.get = jest.fn();
fetchMock.mockReturnValue(
    new Promise((resolve, reject) => resolve({ tasks: [], candidates: [] }))
);

describe('Dashboard', () => {
    beforeEach(jest.clearAllMocks);

    test('handles null task and candidate lists', () => {
        fetchMock.mockReturnValue(
            new Promise((resolve, reject) => resolve({ rows: [] }))
        );

        const dash = shallow(<Dashboard />);
        expect(dash.find('.task').length).toEqual(0);
        expect(dash.find('.candidate').length).toEqual(0);
    });

    describe('with data', () => {
        let dash, rows;

        beforeEach(() => {
            rows = [
                { task: "Dishses", candidate: "Friday Jeb" },
                { task: "Wipe Down", candidate: "Everyday Natalie" },
                { task: "Tablecloth", candidate: "Odd Day Rob" }
            ]

            fetchMock.mockReturnValue(
                new Promise((resolve, reject) => resolve({ rows }))
            );

            dash = shallow(<Dashboard />);
        });

        test('shows list of tasks', () => {
            expect(dash.find('.task').length).toEqual(rows.length);
        });

        test('shows a list of candidates', () => {
            expect(dash.find('.candidate').length).toEqual(rows.length);
        });
    });
});