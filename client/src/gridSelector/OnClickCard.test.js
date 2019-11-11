import {shallow} from "enzyme";
import React from "react";
import OnClickCard from "./OnClickCard";

describe("OnClickCard", () => {
    test('On click function is called', () => {

        let clickCount = 0;
        const clickHandlerSpy = () => clickCount++;
        const onClickCard = shallow(<OnClickCard clickEventHandler={clickHandlerSpy}/>);

        onClickCard.simulate('click');

        expect(clickCount).toEqual(1);
    });

});