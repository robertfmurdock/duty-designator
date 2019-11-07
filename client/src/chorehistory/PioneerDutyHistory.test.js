import React from 'react';
import {shallow} from 'enzyme';
import PioneerDutyHistory from "./PioneerDutyHistory";
import FetchService from "../utilities/services/fetchService";
import {waitUntil, wrapInPromise} from "../utilities/testUtils";
import DutyHistoryTable from "./DutyHistoryTable";

describe('PioneerDutyHistory', () => {
    const fetchMock = FetchService.get = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        fetchMock.mockReturnValue(wrapInPromise(({})));
    });

    it('renders without crashing', () => {
        let dutyHistory = shallow(<PioneerDutyHistory id={'0'}/>);
        expect(dutyHistory.find('.history-header').length).toEqual(1);
    });

    it('will not try to render pioneer if no info is available', () => {
        let dutyHistory = shallow(<PioneerDutyHistory id="7"/>);
        expect(dutyHistory.find('.pioneer-name').length).toEqual(0);
        expect(dutyHistory.find('.no-pioneer').length).toEqual(1);
    });

    describe('fetching pioneers via server', () => {
        const id = 7;
        const name = "Jeff";
        const pioneer = {id, name};

        it('can get a pioneers name from database through fetch', async () => {
            fetchMock.mockReturnValue(wrapInPromise(pioneer));
            let dutyHistory = shallow(<PioneerDutyHistory id={id}/>);
            await waitUntil(() => dutyHistory.find(DutyHistoryTable).length !== 0);
            expect(dutyHistory.find(DutyHistoryTable).props().pioneer.name).toBe(name);
        });

        it('can get a different pioneers name from database through fetch', async () => {
            const differentPioneer = {'id': "Geoffry", 'name': "1"};
            fetchMock.mockReturnValue(wrapInPromise(differentPioneer));
            let dutyHistory = shallow(<PioneerDutyHistory id={id}/>);
            await waitUntil(() => dutyHistory.find(DutyHistoryTable).length !== 0);

            expect(dutyHistory.find(DutyHistoryTable).props().pioneer.name)
                .toBe(differentPioneer.name)
        });

        it('should not show chore rows if no chores are found', async () => {
            fetchMock.mockReturnValue(wrapInPromise(pioneer));
            let dutyHistory = shallow(<PioneerDutyHistory id={id}/>);
            await waitUntil(() => dutyHistory.find(DutyHistoryTable).length !== 0);

            expect(dutyHistory.find(DutyHistoryTable).props().pioneer.name).toBe(name);
            expect(dutyHistory.find(DutyHistoryTable).props().choreCounts.length).toEqual(0);
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

            let dutyHistory = shallow(<PioneerDutyHistory id={pioneer.id}/>);

            expect(dutyHistory.find(DutyHistoryTable).props().pioneer.name).toBe(pioneer.name)
        });

        it('will list users duty history ', async () => {
            const chore2 = {name: "Saloon DJ", id: "8"};
            localStorage.setItem('10/29/2019', stringifyRoster(
                [{pioneer, chore: chore}, {pioneer, chore: chore2}]
            ));
            localStorage.setItem('11/02/2019', stringifyRoster([{pioneer, chore: chore2}]));

            let dutyHistory = shallow(<PioneerDutyHistory id={pioneer.id}/>);
            await waitUntil(() => dutyHistory.find(DutyHistoryTable).length !== 0);

            const choreCounts = dutyHistory.find(DutyHistoryTable).props().choreCounts;
            expect(choreCounts.length).toEqual(2);
            expect(choreCounts[0].name).toBe(chore.name);
            expect(choreCounts[0].count).toBe(1);
            expect(choreCounts[1].name).toBe(chore2.name);
            expect(choreCounts[1].count).toBe(2);
        });
    });
});