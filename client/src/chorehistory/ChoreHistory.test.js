import React from 'react';
import {mount, shallow, render} from 'enzyme';
import ChoreHistory from "./ChoreHistory";
import FetchService from "../utilities/services/fetchService";
import {act} from 'react-dom/test-utils';


xdescribe('ChoreHistory', () => {
    it('renders without crashing', () => {


        let chorehistory;
        act(() => {
            chorehistory = shallow(<ChoreHistory id={'0'}/>);
        })

        expect(chorehistory.find('.pioneer-name').length).toEqual(1);
    });


    it('can get a pioneers name from database through fetch', () => {
        const id = 7;
        const name = "Jeff";
        const pioneer = {id, name};

        FetchService.get = jest.fn().mockReturnValueOnce(
            new Promise(resolve => resolve(pioneer))
        );

        let chorehistory = shallow(<ChoreHistory id={id}/>);
        expect(chorehistory.find('.pioneer-name').text()).toBe(name)
    });

    it('can get a different pioneers name from database through fetch', () => {
        const id = 3;
        const name = "Jeff2";
        const pioneer = {id, name};

        FetchService.get = jest.fn().mockReturnValueOnce(
            new Promise(resolve => resolve(pioneer))
        );

        let chorehistory;
        act(() => {
            chorehistory = mount(<ChoreHistory id={id}/>);
        })
        expect(chorehistory.find('.pioneer-name').text()).toBe(name)
    });

});