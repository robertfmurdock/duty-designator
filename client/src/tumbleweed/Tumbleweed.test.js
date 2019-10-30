import React from "react";
import Tumbleweed from "./Tumbleweed";
import {shallow} from "enzyme";
import App from "../App";

describe('Tumbleweed', () => {
    it('will render in App', () => {
        let app = shallow(<App/>);

        expect(app.find(Tumbleweed).length).toEqual(1)
    })
})