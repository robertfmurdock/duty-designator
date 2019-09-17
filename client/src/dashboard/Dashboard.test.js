import React from 'react';
import { shallow } from 'enzyme';
import Dashboard from './Dashboard';


describe('Dashboard', () => {
    test('handles null task and candidate lists', () => {
        const dash = shallow(<Dashboard/>);
        expect(dash.find('.task').length).toEqual(0);
        expect(dash.find('.candidate').length).toEqual(0);
    });

    describe('with data', () => {
        let dash, tasks, candidates;

        beforeEach(() => {
            tasks = ["Dishes", "Food Storage"];
            candidates = ["Brody", "Danny"];
            dash = shallow(<Dashboard tasks={tasks} candidates={candidates}/>);
        });

        test('shows list of tasks', () => {
            expect(dash.find('.task').length).toEqual(tasks.length);
        });

        test('shows a list of candidates', () => {
            expect(dash.find('.candidate').length).toEqual(candidates.length);
        });
    });
});