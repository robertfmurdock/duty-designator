import React from 'react';
import {shallow} from 'enzyme';
import Results from './Results';
import DutyTable from "../tables/DutyTable";

describe('Results', () => {
    beforeEach(jest.clearAllMocks);

    describe('with pioneer data', () => {
        let results, duties;

        beforeEach(() => {
            duties = [
                {id: " at thing", name: "Friday Jeb", task: "Poop deck scrubber", description: "Scrubbing the poop deck"},
                {id: "something else", name: "Everyday Natalie", task: "Swashbuckler", description: "buckle the swash"},
                {id: "nothing", name: "Odd Day Rob", task: "Musketeer", description: "Man the cannons"}
            ];

            results = shallow(<Results duties={duties}/>);
        });

        test('shows a list of assigned duties', () => {
            const dutyTable = results.find(DutyTable);
            expect(dutyTable.props().duties).toBe(duties);
        });
    });

});