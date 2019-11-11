import {shallow} from "enzyme";
import React from "react";
import ChoreCorral from "./ChoreCorral";
import GridSelector from "../pioneers/GridSelector";
import OnClickCard from "../gridSelector/OnClickCard";

describe('ChoreCorral', () => {
    const sampleChores = [
        {name: "Corraling Kevin", id: "4", description: "Kevin needs to be corralled"}
    ];

    it('renders without crashing', () =>{
        const choreCorral = shallow(<ChoreCorral/>);
    });

    it('has a ChoreGrid selector with passed chores', ()=>{

        const corral = shallow(<ChoreCorral {...{chores: sampleChores}}/>);

        expect(corral.find(GridSelector).props().chores).toEqual(sampleChores)
    });

    it('when OnClickCard is clicked setModalOpen prop is called', () => {
        let clicked = false;
        const setModalOpenSpy = () => {clicked = true};
        const corral = shallow(<ChoreCorral {...{chores: sampleChores}} addChoreHandler={setModalOpenSpy}/>);

        corral.find(GridSelector).dive().find(OnClickCard).dive()
            .find('.open-add-chore-modal-button').simulate('click');

        expect(clicked).toEqual(true);
    })
});