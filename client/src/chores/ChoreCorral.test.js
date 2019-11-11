import {shallow} from "enzyme";
import React from "react";
import ChoreCorral from "./ChoreCorral";
import GridSelector from "../pioneers/GridSelector";

describe('ChoreCorral', () => {
    it('renders without crashing', () =>{
        const choreCorral = shallow(<ChoreCorral/>);
    });

    it('has a ChoreGrid selector with passed chores', ()=>{
        const chores = [
            {name: "Corraling Kevin", id: "4", description: "Kevin needs to be corralled"}
        ];
        const corral = shallow(<ChoreCorral {...{chores}}/>);

        expect(corral.find(GridSelector).props().chores).toEqual(chores)
    })

});