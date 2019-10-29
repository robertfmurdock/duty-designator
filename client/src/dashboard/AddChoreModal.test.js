import React from 'react';
import {shallow} from 'enzyme';
import AddChoreModal from './AddChoreModal.js'
import {Button} from "@material-ui/core";

describe('AddChoreModal', () => {

    describe('with no props', function () {
        let addChoreModal;

        beforeEach(() => {
            addChoreModal = shallow(<AddChoreModal/>);
        });

        it('save button disabled with no data', () => {
            expect(addChoreModal.find(Button).props().disabled).toBeTruthy()
        });

        it('save button enabled with chore name', () => {
            simulateTyping(addChoreModal, '#chore-name', 'Fake Chore Name');
            expect(addChoreModal.find(Button).props().disabled).toBeFalsy()
        });
    });

    it('when the button is clicked, the add chore callback gets the chore', () => {
        let actualChoreVals = {};
        const addChoreSpy = (chore) => actualChoreVals = chore;
        const addChoreModal = shallow(<AddChoreModal onChoreAdd={addChoreSpy}/>);

        const expectedName = simulateTyping(addChoreModal, '#chore-name', 'Fake Chore Name');
        const expectedDescription = simulateTyping(addChoreModal, '#chore-description', 'Fake Chore Description');
        const expectedTitle = simulateTyping(addChoreModal, '#chore-title', 'Crier');

        addChoreModal.find(Button).simulate("click");

        expect(actualChoreVals.name).toBe(expectedName);
        expect(actualChoreVals.description).toBe(expectedDescription);
        expect(actualChoreVals.title).toBe(expectedTitle);
    });

    const simulateTyping = (wrapper, id, value) => {
        wrapper.find(id).simulate('change', {target: {value}});
        return value;
    }
});