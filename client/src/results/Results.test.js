import React from 'react';
import {shallow} from 'enzyme';
import Results from './Results';
import DutyTable from "../tables/DutyTable";
import associate from "./Associator";

describe('Results', () => {
    beforeEach(jest.clearAllMocks);

    describe('with pioneer data and chore data', () => {

        test('given no chores returns nothing', () => {
            const associateFunction = associate;
            const results = shallow(<Results chores={[]} pioneers={[]} associator={associateFunction} />)

            expect(results.find(DutyTable).props().duties).toEqual([]);
        })

        test('given associator that returns 7 get duties of 7', () => {
            const associateFunction = () => {return 7};
            const results = shallow(<Results chores={[]} pioneers={[]} associator={associateFunction} />)

            expect(results.find(DutyTable).props().duties).toEqual(7);
        })

        test('given associate and one pioneer and one chore get one duty', () => {
            const associateFunction = associate;
            const pioneers = ["Pioneer Jeb"]
            const chores = ["codin"]

            const results = shallow(<Results chores={chores} pioneers={chores} associator={associateFunction} />)

            expect(results.find(DutyTable).props().duties.length).toEqual(1);
        })


    });

});