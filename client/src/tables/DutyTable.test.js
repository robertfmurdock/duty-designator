import React from "react";
import {shallow, mount} from "enzyme";
import DutyTable from "./DutyTable";
import {Box, Table, TableBody, TableCell, TableRow} from "@material-ui/core";

describe('Duty Table', () => {

    describe('Given a DutyTable With three duties', () => {
        let table, rows;

        beforeEach(() => {
            rows = [
                {pioneer: {id: 1, name: "Friday Jeb"}, chore: {id: 1, name: "Poop deck scrubber", description: "swabbin dirty duty decks"}},
                {pioneer: {id: 2, name: "Everyday Natalie"}, chore: {id: 2, name: "Swashbuckler", description: "buckle the swash"}},
                {pioneer: {id: 3, name: "Odd Day Rob"}, chore: {id: 3, name: "Musketeer", description: "Man the cannons"}}
            ];
            table = shallow(<DutyTable duties={rows}/>);
        });

        test('shows a list of duties', () => {
            expect(table.find('.duty-pioneer-name').length)
                .toBe(rows.length);
        });

        test('first duty-pioneer-name cell has first pioneer name', () => {
            const firstCell = table.find('.duty-pioneer-name').first()
            expect(firstCell.text()).toEqual("Friday Jeb")
        })

        test('Second duty-pioneer-name cell has second pioneer name', () => {
            const secondCell = table.find('.duty-pioneer-name').at(1)
            expect(secondCell.text()).toEqual("Everyday Natalie")
        })

        test('First duty-chore-name cell has first chore name', () => {
            const firstCell = table.find('.duty-chore-name').first()
            expect(firstCell.text()).toEqual("Poop deck scrubber")
        })

        test('First duty-chore-description cell has first chore description', () => {
            const firstCell = table.find('.duty-chore-description').first()
            expect(firstCell.text()).toEqual("swabbin dirty duty decks")
        })
    });

});