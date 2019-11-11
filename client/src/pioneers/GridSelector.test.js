import React from "react";
import {shallow} from "enzyme";
import GridSelector from "./GridSelector";
import PioneerCard from "./PioneerCard";
import Icon from "@mdi/react";

describe('GridSelector', () => {
    it('given a set of pioneers renders for each pioneer', () => {
        const pioneers = [
            {name: "Goofus", id: "0"},
            {name: "Gallant", id: "1"},
        ];
        const gridSelector = shallow(<GridSelector pioneers={pioneers}/>);

        const cards = gridSelector.find(PioneerCard);
        const cardPioneers = cards.map(card => card.props().pioneer);
        expect(cardPioneers).toEqual(pioneers);
    });



    it('on click remove on card, pioneer is removed', () => {
        const expectedPioneerToRemove = {id: "uniqueId", name: 'WhereIsJeb'};

        let actualRemovedPioneer = null;
        const removeSpy = (removed) => actualRemovedPioneer = removed;
        const table = shallow(<GridSelector
            pioneers={[expectedPioneerToRemove]} onRemove={removeSpy}/>);

        const pioneerCard = table.find(PioneerCard)
            .findWhere(card => card.key() === expectedPioneerToRemove.id);

        pioneerCard.last().dive().find(Icon).simulate("click");

        expect(actualRemovedPioneer).toBe(expectedPioneerToRemove)
    })
});