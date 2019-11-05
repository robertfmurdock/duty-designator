import React from 'react';
import {shallow} from 'enzyme';
import ChoreHistory from "./ChoreHistory";
import FetchService from "../utilities/services/fetchService";
import {waitUntil} from "../utilities/testUtils";
import ChoreHistoryTable from "./ChoreHistoryTable";

const wrapInPromise = response => new Promise(resolve => resolve(response));

describe('ChoreHistory', () => {
    let fetchMock = FetchService.get = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        fetchMock.mockReturnValue(wrapInPromise(({})));
    });

    it('renders without crashing', () => {
        let choreHistory = shallow(<ChoreHistory id={'0'}/>);
        expect(choreHistory.find('.history-header').length).toEqual(1);
    });

    it('will not try to render pioneer if no info is available', () => {
        let choreHistory = shallow(<ChoreHistory id="7"/>);
        expect(choreHistory.find('.pioneer-name').length).toEqual(0);
        expect(choreHistory.find('.no-pioneer').length).toEqual(1);
    });

    describe('fetching pioneers via server', () => {
        const id = 7;
        const name = "Jeff";
        const pioneer = {id, name};

        it('can get a pioneers name from database through fetch', async () => {
            fetchMock.mockReturnValue(wrapInPromise(pioneer));
            let choreHistory = shallow(<ChoreHistory id={id}/>);
            await waitUntil(() => choreHistory.find(ChoreHistoryTable).length !== 0);
            expect(choreHistory.find(ChoreHistoryTable).props().pioneer.name).toBe(name);
        });

        it('can get a different pioneers name from database through fetch', async () => {
            const differentPioneer = {'id': "Geoffry", 'name': "1"};
            fetchMock.mockReturnValue(wrapInPromise(differentPioneer));
            let choreHistory = shallow(<ChoreHistory id={id}/>);
            await waitUntil(() => choreHistory.find(ChoreHistoryTable).length !== 0);

            expect(choreHistory.find(ChoreHistoryTable).props().pioneer.name)
                .toBe(differentPioneer.name)
        });

        it('should not show chore rows if no chores are found', async () => {
            fetchMock.mockReturnValue(wrapInPromise(pioneer));
            let choreHistory = shallow(<ChoreHistory id={id}/>);
            await waitUntil(() => choreHistory.find(ChoreHistoryTable).length !== 0);

            expect(choreHistory.find(ChoreHistoryTable).props().pioneer.name).toBe(name);
            expect(choreHistory.find(ChoreHistoryTable).props().choreCounts.length).toEqual(0);
        });
    });

    describe('fetching pioneer via local storage', () => {
        const pioneer = {name: "Juan Bonfante", id: "4"};
        const chore = {name: "Cable Wrangler", id: "74"};

        const stringifyRoster = roster => JSON.stringify({dutyRoster: roster});

        it('can get single pioneer from local storage with arbitrary date', () => {
            localStorage.setItem('10/29/2019', stringifyRoster(
                [{pioneer: {name: "Guy", id: "7"}, chore}]
            ));
            localStorage.setItem('11/01/2019', stringifyRoster(false));
            localStorage.setItem('11/02/2019', stringifyRoster([{pioneer, chore}]));

            let choreHistory = shallow(<ChoreHistory id={pioneer.id}/>);

            expect(choreHistory.find(ChoreHistoryTable).props().pioneer.name).toBe(pioneer.name)
        });

        it('will list users chore history ', async () => {
            const chore2 = {name: "Saloon DJ", id: "8"};
            localStorage.setItem('10/29/2019', stringifyRoster(
                [{pioneer, chore: chore}, {pioneer, chore: chore2}]
            ));
            localStorage.setItem('11/02/2019', stringifyRoster([{pioneer, chore: chore2}]));

            let choreHistory = shallow(<ChoreHistory id={pioneer.id}/>);
            await waitUntil(() => choreHistory.find(ChoreHistoryTable).length !== 0);

            const choreCounts = choreHistory.find(ChoreHistoryTable).props().choreCounts;
            expect(choreCounts.length).toEqual(2);
            expect(choreCounts[0].name).toBe(chore.name);
            expect(choreCounts[0].count).toBe(1);
            expect(choreCounts[1].name).toBe(chore2.name);
            expect(choreCounts[1].count).toBe(2);
        });
    });
});