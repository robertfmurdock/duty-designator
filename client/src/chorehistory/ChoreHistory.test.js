import React from 'react';
import {shallow} from 'enzyme';
import ChoreHistory from "./ChoreHistory";
import FetchService from "../utilities/services/fetchService";
import {waitUntil} from "../utilities/testUtils";

describe('ChoreHistory', () => {
    let fetchMock;

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        fetchMock = FetchService.post = jest.fn();
        fetchMock.mockReturnValue(wrapInPromise(({})));
    });

    it('renders without crashing', () => {
        let choreHistory = shallow(<ChoreHistory id={'0'}/>);
        expect(choreHistory.find('.history-header').length).toEqual(1);
    });


    it('can get a pioneers name from database through fetch', async () => {
        const id = 7;
        const name = "Jeff";

        fetchMock.mockReturnValue(
            wrapInPromise({id, name})
        );

        let choreHistory = shallow(<ChoreHistory id={id}/>);
        await waitUntil(() => choreHistory.find('.pioneer-name').length !== 0);

        expect(choreHistory.find('.pioneer-name').text()).toBe(name);
    });

    it('can get a different pioneers name from database through fetch', async () => {
        const id = 3;
        const name = "Greg";

        fetchMock.mockReturnValue(
            wrapInPromise({id, name})
        );

        let choreHistory = shallow(<ChoreHistory id={id}/>);
        await waitUntil(() => choreHistory.find('.pioneer-name').length !== 0);
        expect(choreHistory.find('.pioneer-name').text()).toBe(name)
    });

    it('can get single pioneer from local storage with arbitrary date', () => {
        const pioneer = {name: "Juan Bonfante", id: "4"};
        localStorage.setItem('10/29/2019', JSON.stringify({dutyRoster: [{pioneer: {name: "Guy", id: "7"}, chore: {}}]}));
        localStorage.setItem('11/01/2019', JSON.stringify({dutyRoster: false}));
        localStorage.setItem('11/02/2019', JSON.stringify({dutyRoster: [{pioneer, chore: {}}]}));

        let choreHistory = shallow(<ChoreHistory id={pioneer.id}/>);

        expect(choreHistory.find('.pioneer-name').text()).toBe(pioneer.name)
    });

    it('will not try to render pioneer if no info is available', () => {
        let choreHistory = shallow(<ChoreHistory id="7"/>);
        expect(choreHistory.find('.pioneer-name').length).toEqual(0);
        expect(choreHistory.find('.no-pioneer').length).toEqual(1);
    });

    it('should not show chore rows if no chores are found', async () => {
        const id = 3;
        const name = "Greg";

        fetchMock.mockReturnValue(
            wrapInPromise({id, name})
        );

        let choreHistory = shallow(<ChoreHistory id={id}/>);
        await waitUntil(() => choreHistory.find('.pioneer-name').length !== 0);
        expect(choreHistory.find('.pioneer-name').text()).toBe(name)
        expect(choreHistory.find('.chore-name').length).toEqual(0);
        expect(choreHistory.find('.chore-description').length).toEqual(0);
    });

    it('will list users chore history ', async () => {
        const pioneer = {name: "Juan Bonfante", id: "4"};
        const chore1 = {name: "Cable Wrangler", id: "74"};
        const chore2 = {name: "Saloon DJ", id: "8"};
        localStorage.setItem('10/29/2019', JSON.stringify({dutyRoster: [{pioneer, chore: chore1}, {pioneer, chore: chore2}]}));
        localStorage.setItem('11/02/2019', JSON.stringify({dutyRoster: [{pioneer, chore: chore2}]}));

        let choreHistory = shallow(<ChoreHistory id={pioneer.id}/>);
        await waitUntil(() => choreHistory.find('.chore-name').length !== 0);

        expect(choreHistory.find('.chore-name').at(0).text()).toBe(chore1.name);
        expect(choreHistory.find('.chore-count').at(0).text()).toBe("1");
        expect(choreHistory.find('.chore-name').at(1).text()).toBe(chore2.name);
        expect(choreHistory.find('.chore-count').at(1).text()).toBe("2");
    });

    const wrapInPromise = response => new Promise(resolve => resolve(response));
});