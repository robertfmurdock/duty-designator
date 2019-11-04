import React from 'react';
import {shallow} from 'enzyme';
import ChoreHistory from "./ChoreHistory";
import FetchService from "../utilities/services/fetchService";
import {waitUntil} from "../utilities/testUtils";

describe('ChoreHistory', () => {
    let fetchMock;

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock = FetchService.post = jest.fn();
        fetchMock.mockReturnValue(wrapInPromise(({})));
    });

    it('renders without crashing', () => {
        let choreHistory = shallow(<ChoreHistory id={'0'}/>);
        expect(choreHistory.find('.pioneer-name').length).toEqual(1);
    });


    it('can get a pioneers name from database through fetch', async () => {
        const id = 7;
        const name = "Jeff";

        fetchMock.mockReturnValue(
            wrapInPromise({id, name})
        );

        let choreHistory = shallow(<ChoreHistory id={id}/>);
        await waitUntil(() => choreHistory.find('.pioneer-name').text() !== "");

        expect(choreHistory.find('.pioneer-name').text()).toBe(name);
    });

    it('can get a different pioneers name from database through fetch', async () => {
        const id = 3;
        const name = "Greg";

        fetchMock.mockReturnValue(
            wrapInPromise({id, name})
        );

        let choreHistory = shallow(<ChoreHistory id={id}/>);
        await waitUntil(() => choreHistory.find('.pioneer-name').text() !== "");
        expect(choreHistory.find('.pioneer-name').text()).toBe(name)
    });

    const wrapInPromise = response => new Promise(resolve => resolve(response));
});