import React from "react";
import {shallow} from "enzyme";
import {TableCell, TableBody, TableRow, Typography} from "@material-ui/core";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";

import ChoreTable from "./ChoreTable";

describe("ChoreTable", () => {

    test('add chore button calls handler', () => {
        const chores = [];
        let handleAddWasCalled = false;
        const handleAdd = () => handleAddWasCalled = true;
        const choreTable = shallow(<ChoreTable chores={chores} addChoreHandler={handleAdd}/>);

        choreTable.find('#add-chore-button').simulate('click');

        expect(handleAddWasCalled).toEqual(true);
    });

    test('On click remove, wll use remove callback', () => {
        const expectedChoreToRemove = {id: "uniqueId", name: 'CleanTheTHings'};

        let actualRemovedChore = null;
        const removeSpy = (removed) => actualRemovedChore = removed;
        const table = shallow(<ChoreTable chores={[expectedChoreToRemove]} onRemove={removeSpy}/>);

        const pioneerRow = table.find(TableBody)
            .find(TableRow)
            .findWhere(row => row.key() === expectedChoreToRemove.id);

        pioneerRow.find(TableCell).last().find(Icon)
            .simulate("click");

        expect(actualRemovedChore).toBe(expectedChoreToRemove)
    });

    describe('when given a list of chores', () => {

        let chores, choreTable;
        beforeEach(() => {
            chores = [
                {id: "1", task: "Move chairs"},
                {id: "2", task: "Turn off coffee pot"},
                {id: "3", task: "Stock fridge with soda"},
                {id: "4", task: "Put away dishes"},
            ];

            choreTable = shallow(<ChoreTable chores={chores} addChoreHandler={() => ({})}/>);
        });

        test('shows a list of chores', () => {
            expect(choreTable.find('.chore-name').length).toBe(chores.length);
        });

        test('Has header of Today\'s Chores', () => {
            expect(choreTable.find(".table-title").text()).toEqual("Today\'s CHORES");
        });

        const choreIds = () => chores.map(chore => chore.id);

        test('Each chore has a remove button in last cell position', () => {
            const choreRows = choreTable.find(TableBody)
                .find(TableRow)
                .filterWhere(
                    row => choreIds().includes(row.key())
                );

            choreRows.forEach(element => {
                const lastTableCell = element.find(TableCell).last();
                const icon = lastTableCell.find(Icon);
                expect(icon.length).toBe(1);
                expect(icon.props().path).toBe(mdiClose);
                expect(icon.props().size).toBe(1)
            });
        });
    });
});