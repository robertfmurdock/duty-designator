import React from "react";
import {shallow} from "enzyme";
import CorralCard from "./CorralCard";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";

describe('CorralCard', () => {
    it('Has an element with class pioneer-name', () => {
        const pioneer = {name: "Cardy McCard", id: "aces"};
        const card = shallow(<CorralCard item={pioneer}/>);
        expect(card.find('.corral-card').text()).toEqual(pioneer.name)
    });

    describe('given removable property', () => {

        let card;
        let onRemove;
        beforeEach(() => {
            const pioneer = {name: "Cardy McCard", id: "aces"};
            onRemove = jest.fn();
            card = shallow(<CorralCard item={pioneer} removable={true} onRemove={onRemove}/>);
        });

        it('will include remove button', () => {
            const iconWrapper = card.find(Icon);
            expect(iconWrapper.props().path)
                .toEqual(mdiClose);
            expect(iconWrapper.props().className)
                .toEqual('delete');
        });

        it('clicking remove button will call onRemove', () => {
            card.find('.delete').simulate('click');
            expect(onRemove.mock.calls.length).toEqual(1);
        });
    });

    it('not given removable property, will not include remove button', () => {
        const pioneer = {name: "Cardy McCard", id: "aces"};
        const card = shallow(<CorralCard item={pioneer}/>);
        const iconWrapper = card.find(Icon);
        expect(iconWrapper.length).toBe(0);
    });

});