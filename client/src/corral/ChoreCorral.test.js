import {shallow} from "enzyme";
import {AddChoreModal, ChoreTable, PioneerTable} from "../dashboard";
import React from "react";
import ChoreCorral from "./ChoreCorral";
import FetchService from "../utilities/services/fetchService";
import {waitUntil, wrapInPromise} from "../utilities/testUtils";
import PioneerCorral from "./PioneerCorral";

describe('ChoreCorral', function () {
    it('handles null chore and pioneer lists', async function () {
        const choreCorral = shallow(<ChoreCorral/>);

        expect(choreCorral.find(PioneerCorral).props()["pioneers"].length).toEqual(0);
        expect(choreCorral.find(ChoreTable).props()["chores"].length).toEqual(0);
    });

    it('ChoreTable can open modal', async () => {
        const choreCorral = shallow(<ChoreCorral/>);

        choreCorral.find(ChoreTable)
            .props()
            ["addChoreHandler"]();

        expect(choreCorral.find(AddChoreModal).prop('open')).toEqual(true);
    });

    it('when given chore and pioneer lists, no fetches will occur', () => {
        const pioneers = [{id: 'something else', name: 'Everyday Natalie'}];
        const chores = [{id: 'bg', name: 'Bean Grinder'}];

        const fetchMock = FetchService.get = jest.fn();

        const wrapper = shallow(<ChoreCorral pioneers={pioneers} chores={chores}/>);

        expect(fetchMock.mock.calls.length).toBe(0);
        expect(wrapper.find(PioneerCorral).props()["pioneers"]).toEqual(pioneers);
        expect(wrapper.find(ChoreTable).props()["chores"]).toEqual(chores);
    });

    describe('with pioneer data', () => {
        let choreCorral, pioneers;

        beforeEach(() => {
            pioneers = [
                {id: ' at thing', name: 'Friday Jeb'},
                {id: 'something else', name: 'Everyday Natalie'},
                {id: 'nothing', name: 'Odd Day Rob'}
            ];

            let fetchMock = FetchService.get = jest.fn();
            fetchMock.mockReturnValue(wrapInPromise(pioneers));

            choreCorral = shallow(<ChoreCorral/>);
        });

        it('shows a list of pioneers', () => {
            const pioneerCorral = choreCorral.find(PioneerCorral);
            expect(pioneerCorral.props()["pioneers"]).toBe(pioneers);
        });

        it('When PioneerTable remove last Pioneer, last Pioneer row is removed', () => {
            let pioneerToRemove = pioneers[2];
            simulateRemovePioneer(pioneerToRemove);

            expect(choreCorral.find(PioneerCorral).props()["pioneers"]).toEqual(pioneers.slice(0, 2))
        });

        it('When PioneerTable remove middle Pioneer, middle Pioneer row is removed', () => {
            let pioneerToRemove = pioneers[1];
            simulateRemovePioneer(pioneerToRemove);

            const expectedRemaining = [pioneers[0], pioneers[2]];
            expect(choreCorral.find(PioneerCorral).props()["pioneers"]).toEqual(expectedRemaining)
        });

        it('Reset button presents default page', async () => {
            let pioneerToRemove = pioneers[0];
            simulateRemovePioneer(pioneerToRemove);

            choreCorral.find('#reset-button').simulate('click');

            await waitUntil(() =>
                choreCorral.find(PioneerCorral).props()["pioneers"].length === pioneers.length);

            expect(choreCorral.find(PioneerCorral).props()["pioneers"]).toEqual(pioneers)
        });

        function simulateRemovePioneer(pioneerToRemove) {
            let removeFunction = choreCorral.find(PioneerCorral).props()["onRemove"];
            removeFunction(pioneerToRemove)
        }
    });

    describe('with chore data', () => {
        let choreCorral, chores;

        beforeEach(() => {
            chores = [
                {id: '1', name: 'Move chairs'},
                {id: '2', name: 'Turn off coffee pot'},
                {id: '3', name: 'Stock fridge with soda'},
                {id: '4', name: 'Put away dishes'},
            ];

            let fetchMock = FetchService.get = jest.fn();
            fetchMock.mockReturnValue(wrapInPromise(chores));
            choreCorral = shallow(<ChoreCorral/>);
        });

        it('will send chores to chore table', () => {
            const chores = choreCorral.find(ChoreTable).props()["chores"];
            expect(chores).toEqual(chores);
        });

        it('When ChoreTable remove a chore, the chore entry is removed', () => {
            const choreToRemove = chores[1];
            const expectedRemaining = [chores[0], chores[2], chores[3]];
            simulateRemoveChore(choreToRemove);

            expect(choreCorral.find(ChoreTable).props()["chores"]).toEqual(expectedRemaining)
        });

        it('When AddChoreModal adds a chore, the chore entry is added to the list', () => {
            const newChore = {id: '5', name: 'Super Easy Chore', description: 'Its so easy', title: 'Mouse'};
            const expectedChores = [...chores, newChore];
            choreCorral.find(AddChoreModal)
                .props()["onChoreAdd"](newChore);

            expect(choreCorral.find(ChoreTable).props()["chores"]).toEqual(expectedChores)
        });

        function simulateRemoveChore(pioneerToRemove) {
            let removeFunction = choreCorral.find(ChoreTable).props()["onRemove"];
            removeFunction(pioneerToRemove)
        }
    });
});