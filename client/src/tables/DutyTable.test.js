import React from "react";
import {shallow} from "enzyme";
import DutyTable from "./DutyTable";

describe('Duty Table', () => {

    describe('Given a DutyTable With three duties', () => {
        let table, rows;

        beforeEach(() => {
            rows = [
                {id: " at thing", name: "Friday Jeb", task: "Poop deck scrubber", description: "Scrubbing the poop deck"},
                {id: "something else", name: "Everyday Natalie", task: "Swashbuckler", description: "buckle the swash"},
                {id: "nothing", name: "Odd Day Rob", task: "Musketeer", description: "Man the cannons"}
            ];
            table = shallow(<DutyTable duties={rows}/>);
        });

        test('shows a list of duties', () => {
            expect(table.find('.duty').length)
                .toBe(rows.length);
        });
    });

});