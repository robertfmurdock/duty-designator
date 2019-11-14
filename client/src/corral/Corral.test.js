import {shallow} from "enzyme";
import {AddChoreModal} from "../dashboard";
import React from "react";
import Corral from "./Corral";
import FetchService from "../utilities/services/fetchService";
import {waitUntil} from "../utilities/testUtils";
import PioneerCorral from "../pioneers/PioneerCorral";
import ChoreCorral from "../chores/ChoreCorral";
import GridSelector from "../gridSelector/GridSelector";

describe('Corral', function () {
    it('handles null chore and pioneer lists', async function () {
        const corral = shallow(<Corral/>);

        expect(corral.find(PioneerCorral).props()["pioneers"].length).toEqual(0);
        expect(corral.find(ChoreCorral).props()["chores"].length).toEqual(0);
    });

    it('ChoreTable can open modal', async () => {
        const corral = shallow(<Corral/>);

        corral.find(ChoreCorral)
            .props()
            ["addChoreHandler"]();

        expect(corral.find(AddChoreModal).prop('open')).toEqual(true);
    });

    it('when given chore and pioneer lists, no fetches will occur', () => {
        const pioneers = [{id: 'something else', name: 'Everyday Natalie'}];
        const chores = [{id: 'bg', name: 'Bean Grinder'}];

        const fetchMock = FetchService.get = jest.fn();

        const wrapper = shallow(<Corral pioneers={pioneers} chores={chores}/>);

        expect(fetchMock.mock.calls.length).toBe(0);
        expect(wrapper.find(PioneerCorral).props()["pioneers"]).toEqual(pioneers);
        expect(wrapper.find(ChoreCorral).props()["chores"]).toEqual(chores);
    });

    describe('with pioneer data', () => {
        let corral, pioneers;

        beforeEach(() => {
            pioneers = [
                {id: ' at thing', name: 'Friday Jeb'},
                {id: 'something else', name: 'Everyday Natalie'},
                {id: 'nothing', name: 'Odd Day Rob'}
            ];

            corral = shallow(<Corral pioneers={pioneers} chores={[]}/>);
        });

        it('shows a list of pioneers', () => {
            const pioneerCorral = corral.find(PioneerCorral);
            expect(pioneerCorral.props()["pioneers"]).toBe(pioneers);
        });

        it('When PioneerTable remove last Pioneer, last Pioneer row is removed', () => {
            let pioneerToRemove = pioneers[2];
            simulateRemovePioneer(pioneerToRemove);

            expect(corral.find(PioneerCorral).props()["pioneers"]).toEqual(pioneers.slice(0, 2))
        });

        it('When PioneerTable remove middle Pioneer, middle Pioneer row is removed', () => {
            let pioneerToRemove = pioneers[1];
            simulateRemovePioneer(pioneerToRemove);

            const expectedRemaining = [pioneers[0], pioneers[2]];
            expect(corral.find(PioneerCorral).props()["pioneers"]).toEqual(expectedRemaining)
        });

        it('Reset button will fetch pioneers again', async () => {
            let fetchMock = FetchService.get = jest.fn();
            fetchMock.mockReturnValue(Promise.resolve(pioneers));

            corral = shallow(<Corral/>);

            let pioneerToRemove = pioneers[0];
            simulateRemovePioneer(pioneerToRemove);

            corral.find('#reset-button').simulate('click');

            await waitUntil(() =>
                corral.find(PioneerCorral).props()["pioneers"].length === pioneers.length);

            expect(corral.find(PioneerCorral).props()["pioneers"]).toEqual(pioneers)
        });

        function simulateRemovePioneer(pioneerToRemove) {
            let removeFunction = corral.find(PioneerCorral).props()["onRemove"];
            removeFunction(pioneerToRemove)
        }
    });

    describe('with chore data', () => {
        let corral, chores;

        beforeEach(() => {
            chores = [
                {id: '1', name: 'Move chairs'},
                {id: '2', name: 'Turn off coffee pot'},
                {id: '3', name: 'Stock fridge with soda'},
                {id: '4', name: 'Put away dishes'},
            ];

            corral = shallow(<Corral pioneers={[]} chores={chores}/>);
        });

        it('will send chores to chore table', () => {
            const chores = corral.find(ChoreCorral).props()["chores"];
            expect(chores).toEqual(chores);
        });

        it('When ChoreCorral removes a chore, the chore entry is removed', () => {
            const choreToRemove = chores[1];
            const expectedRemaining = [chores[0], chores[2], chores[3]];
            simulateRemoveChore(choreToRemove);

            expect(corral.find(ChoreCorral).props()["chores"]).toEqual(expectedRemaining)
        });

        it('When AddChoreModal adds a chore, the chore entry is added to the list', () => {
            const newChore = {id: '5', name: 'Super Easy Chore', description: 'Its so easy', title: 'Mouse'};
            const expectedChores = [...chores, newChore];
            corral.find(AddChoreModal)
                .props()["onChoreAdd"](newChore);

            expect(corral.find(ChoreCorral).props()["chores"]).toEqual(expectedChores)
        });

        function simulateRemoveChore(choreToRemove) {
            const removeFunction = corral.find(ChoreCorral).dive().find(GridSelector).props()['onRemove']
            removeFunction(choreToRemove)
        }
    });
});