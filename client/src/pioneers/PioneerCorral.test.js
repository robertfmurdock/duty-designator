import PioneerCorral from "./PioneerCorral";
import React from "react";
import {shallow} from "enzyme";
import PioneerGridSelector from "./GridSelector";

describe('PioneerCorral', () => {
   it('has a PioneerGrid selector with passed pioneers', ()=>{
       const pioneers = [
           {name: "Corralled Kevin", id: "4"}
       ];
       const corral = shallow(<PioneerCorral {...{pioneers}}/>);

       expect(corral.find(PioneerGridSelector).props().pioneers).toEqual(pioneers)
   })
});