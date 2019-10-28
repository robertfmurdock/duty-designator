import DutyRoster from "./DutyRoster";
import {shallow} from 'enzyme';
import React from "react";
import associate from "./Associator";
import DutyTable from "../duties/DutyTable";

describe('DutyRoster', function () {
    describe('with no dutyRoster', function () {

        it('save will persist new duty roster', function(){
            const onSave = jest.fn();
            const associator = jest.fn();
            const expectedDutyRoster = [{name: 'jack', chore: 'jest'}];
            associator.mockReturnValue(expectedDutyRoster)
            const dutyRoster = shallow(<DutyRoster
                dutyRoster={undefined}
                onSave={onSave}
                associator={associator}
            />);
            dutyRoster.find('#save').simulate('click');
            expect(onSave.mock.calls[0][0]).toBe(expectedDutyRoster);
        })

        test('given no chores returns nothing', () => {
            const associateFunction = associate;
            const results = shallow(<DutyRoster chores={[]} pioneers={[]} associator={associateFunction} />)

            expect(results.find(DutyTable).props().duties).toEqual([]);
        })

        test('given associator that returns 7 get duties of 7', () => {
            const associateFunction = () => {return 7};
            const results = shallow(<DutyRoster chores={[]} pioneers={[]} associator={associateFunction} />)

            expect(results.find(DutyTable).props().duties).toEqual(7);
        })

        test('given associate and one pioneer and one chore get one duty', () => {
            const associateFunction = associate;
            const pioneers = ["Pioneer Jeb"]
            const chores = ["codin"]

            const results = shallow(<DutyRoster chores={chores} pioneers={pioneers} associator={associateFunction} />)

            expect(results.find(DutyTable).props().duties.length).toEqual(1);
        })
    })
})