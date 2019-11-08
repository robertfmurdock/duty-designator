import React from "react";
import {shallow} from "enzyme";
import PioneerCard from "./PioneerCard";

describe('PioneerCard', () => {
   it('Has an element with class pioneer-name', () => {
       const pioneer = {name: "Cardy McCard", id: "aces"};
       const card = shallow(<PioneerCard pioneer={pioneer}/>);
       expect(card.find('.pioneer-name').text()).toEqual(pioneer.name)
   });
});