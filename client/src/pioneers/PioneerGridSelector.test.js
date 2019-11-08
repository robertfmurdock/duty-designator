import React from "react";
import {shallow} from "enzyme";
import PioneerGridSelector from "./PioneerGridSelector";
import PioneerCard from "./PioneerCard";

describe('PioneerGridSelector', () => {
    it('given a set of pioneers renders for each pioneer', () => {
        const pioneers = [
            {name: "Goofus", id: "0"},
            {name: "Gallant", id: "1"},
        ];
        const gridSelector = shallow(<PioneerGridSelector pioneers={pioneers}/>);

        const cards = gridSelector.find(PioneerCard);
        const cardPioneers = cards.map(card => card.props().pioneer);
        expect(cardPioneers).toEqual(pioneers);
    });
});