import {shallow} from "enzyme";
import React from "react";
import ChoreTable from "./ChoreTable";
import {TableHead} from "@material-ui/core";

describe("ChoreTable", () => {

    test('add chore button calls handler', () => {
        const chores = [];
        let handleAddWasCalled = false;
        const handleAdd = () => handleAddWasCalled = true;
        const choreTable = shallow(<ChoreTable chores={chores} addChoreHandler={handleAdd}/>);

        choreTable.find('#add-chore-button').simulate('click');

        expect(handleAddWasCalled).toEqual(true);
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
            expect(choreTable.find('.chore').length).toBe(chores.length);
        });

        test('Has header of Today\'s Chores', () => {
            expect(choreTable.find(TableHead).at(0).text()).toEqual("Today\'s Chores");
        })
    })

});