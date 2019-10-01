import React from 'react';
import {shallow} from 'enzyme';
import AddChoreModal from './AddChoreModal.js'

describe('AddChoreModal', () => {
    let dialog;
    beforeEach(() => {
        dialog = shallow(<AddChoreModal/>);
    });
    test('save button disabled with no data', () => {

        expect(dialog.find('#save-chore-button').props().disabled).toBeTruthy()
    });

    test('save button enabled with chore name', () => {

        dialog.find('#chore-name').simulate('change', {target: {value: 'Fake Chore Name'}});

        expect(dialog.find('#save-chore-button').props().disabled).toBeFalsy()
    });
});