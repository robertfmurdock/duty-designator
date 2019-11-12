import React from "react";
import {shallow} from "enzyme";
import DutyCard from "./DutyCard";
import {Card, CardHeader} from "@material-ui/core";

describe('Duty Card', () => {
    let appleDuty, orangeDuty;
    let appleDutyCard, orangeDutyCard;

    beforeEach( () => {
        appleDuty = {
            pioneer: {name: "Stebe", id: "1"},
            chore: {name: "makin' apples", id: "a", description: "Yup", title: "the boss"}
        };
        appleDutyCard = shallow(<DutyCard duty={appleDuty}/>);
        
        orangeDuty = {
            pioneer: {name: "Joey", id: "2"},
            chore: {name: "squeezin' oranges", id: "b", description: "Nope", title: "the exploited worker"}
        };
        orangeDutyCard = shallow(<DutyCard duty={orangeDuty}/>)
    });

    it('Has a card element', () => {
        const dutyCard = shallow(<DutyCard duty={appleDuty}/>);

        expect(dutyCard.find(Card).length).toBe(1)
    });

    it('when passed appleDuty has pioneer name in the CardHeader', () => {
       expect(appleDutyCard.find(CardHeader).props().title)
           .toEqual(appleDuty.pioneer.name)
    });

    it('when passed appleDuty has chore-name class with chore name', () => {
       expect(appleDutyCard.find(Card).find('.chore-name').text())
           .toEqual(appleDuty.chore.name)
    });

    it('when passed appleDuty has chore-description class with chore description', () => {
       expect(appleDutyCard.find(Card).find('.chore-description').text())
           .toEqual(appleDuty.chore.description)
    });


    it('when passed appleDuty has chore-title class with chore title', () => {
        expect(appleDutyCard.find(Card).find('.chore-title').text())
            .toEqual(appleDuty.chore.title)
    });
    
    it('when passed orangeDuty has pioneer name in the CardHeader', () => {
       expect(orangeDutyCard.find(CardHeader).props().title)
           .toEqual(orangeDuty.pioneer.name)
    });

    it('when passed orangeDuty has chore-name class with chore name', () => {
       expect(orangeDutyCard.find(Card).find('.chore-name').text())
           .toEqual(orangeDuty.chore.name)
    });

    it('when passed orangeDuty has chore-description class with chore description', () => {
       expect(orangeDutyCard.find(Card).find('.chore-description').text())
           .toEqual(orangeDuty.chore.description)
    });

    it('when passed orangeDuty has chore-title class with chore title', () => {
       expect(orangeDutyCard.find(Card).find('.chore-title').text())
           .toEqual(orangeDuty.chore.title)
    });
});