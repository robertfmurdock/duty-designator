import React from 'react';
import {shallow} from 'enzyme';
import AddChoreModal from './AddChoreModal.js'
import {Button} from "@material-ui/core";

describe('AddChoreModal', () => {
    let dialog;

    beforeEach(() => {
        dialog = shallow(<AddChoreModal/>);
    });

    test('save button disabled with no data', () => {
        expect(dialog.find(Button).props().disabled).toBeTruthy()
    });

    test('save button enabled with chore name', () => {
        simulateTyping('#chore-name', 'Fake Chore Name');
        expect(dialog.find(Button).props().disabled).toBeFalsy()
    });

    test('save button enabled with chore name', () => {
        simulateTyping('#chore-name', 'Fake Chore Name');
        expect(dialog.find(Button).props().disabled).toBeFalsy()
    });

    test('save button does the things', () => {
        let actualChoreVals = {};
        const addChoreSpy = (name, description) => actualChoreVals = {name, description};
        dialog.setProps({addChore: addChoreSpy});

        const expectedName = simulateTyping('#chore-name', 'Fake Chore Name');
        const expectedDescription = simulateTyping('#chore-description', 'Fake Chore Description');

        dialog.find(Button).simulate("click");

        expect(actualChoreVals.name).toBe(expectedName);
        expect(actualChoreVals.description).toBe(expectedDescription);
    });

    const simulateTyping = (id, value) => {
        dialog.find(id).simulate('change', {target: {value}});
        return value;
    }
});