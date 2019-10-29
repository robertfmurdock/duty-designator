import React from "react";
import {shallow} from "enzyme";
import DutyTable from "./DutyTable";
import {TableRow} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";

describe('Duty Table', () => {

    describe('Given a DutyTable With three duties', () => {
        let table, duties;

        beforeEach(() => {
            duties = [
                {
                    pioneer: {id: 1, name: "Friday Jeb"},
                    chore: {
                        id: 1,
                        name: "Poop deck scrubber",
                        description: "swabbin' dirty duty decks",
                        title: 'Swabbie'
                    }
                },
                {
                    pioneer: {id: 2, name: "Everyday Natalie"},
                    chore: {id: 2, name: "Swashbuckler", description: "buckle the swash"}
                },
                {
                    pioneer: {id: 3, name: "Odd Day Rob"},
                    chore: {id: 3, name: "Musketeer", description: "Man the cannons"}
                }
            ];
            table = shallow(<DutyTable duties={duties}/>);
        });

        it('all the properties are in the same column as their header', () => {
            const headerRow = table.find(TableRow).at(0);
            expect(headerRow.find(TableCell).map(cell => cell.text()))
                .toEqual(['TITLE', 'PIONEER', 'CHORE', 'DESCRIPTION']);

            const firstDutyRow = table.find(TableRow).at(1);

            expect(firstDutyRow.find(TableCell).map(cell => cell.text()))
                .toEqual([
                    duties[0].chore.title,
                    duties[0].pioneer.name,
                    duties[0].chore.name,
                    duties[0].chore.description
                ])
        });

        it('shows a list of duties', () => {
            expect(table.find('.duty-pioneer-name').length)
                .toBe(duties.length);
        });

        it('first duty-pioneer-title has the chore title', () => {
            const firstCell = table.find('.duty-pioneer-title').first();
            expect(firstCell.text()).toEqual(duties[0].chore.title)
        });

        it('first duty-pioneer-name cell has first pioneer name', () => {
            const firstCell = table.find('.duty-pioneer-name').first();
            expect(firstCell.text()).toEqual("Friday Jeb")
        });

        it('Second duty-pioneer-name cell has second pioneer name', () => {
            const secondCell = table.find('.duty-pioneer-name').at(1);
            expect(secondCell.text()).toEqual("Everyday Natalie")
        });

        it('First duty-chore-name cell has first chore name', () => {
            const firstCell = table.find('.duty-chore-name').first();
            expect(firstCell.text()).toEqual("Poop deck scrubber")
        });

        it('First duty-chore-description cell has first chore description', () => {
            const firstCell = table.find('.duty-chore-description').first();
            expect(firstCell.text()).toEqual("swabbin' dirty duty decks")
        })
    });

});