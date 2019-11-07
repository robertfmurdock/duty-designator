import React from 'react';
import FetchService from "../utilities/services/fetchService";
import {waitUntil, wrapInPromise} from "../utilities/testUtils";
import {shallow} from "enzyme";
import PioneerStatistics from "./PioneerStatistics";

describe('pioneer statistics', () => {
    const fetchMock = FetchService.get = jest.fn();
    const jeb = {id: '42', name: 'Friday Jeb'};
    const natalie = {id: '64', name: 'Everyday Natalie'};
    const rob = {id: '89', name: 'Odd Day Rob'};

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        fetchMock.mockReturnValue(wrapInPromise(([])));
    });

    it('should fetch all pioneers and render them in alphabetical order', async () => {
        const pioneers = [jeb, natalie, rob];
        fetchMock.mockReturnValue(wrapInPromise(pioneers));
        const statistics = shallow(<PioneerStatistics/>);

        await waitUntil(() => statistics.find('.pioneer-link').length !== 0);

        expect(statistics.find('.pioneer-link').length).toEqual(pioneers.length);
        expect(statistics.find('.pioneer-name').at(0).text()).toBe(natalie.name);
        expect(statistics.find('.pioneer-name').at(1).text()).toBe(jeb.name);
        expect(statistics.find('.pioneer-name').at(2).text()).toBe(rob.name);
    });
});