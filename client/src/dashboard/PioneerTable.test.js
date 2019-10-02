import {shallow} from "enzyme";
import {TableHead} from "@material-ui/core";
import React from "react";
import PioneerTable from "./PioneerTable";

describe('Pioneer Table', () => {

    let table, rows;

    beforeEach(() => {
        rows = [
            {id: " at thing", candidate: "Friday Jeb"},
            {id: "somethign else", candidate: "Everyday Natalie"},
            {id: "nothing", candidate: "Odd Day Rob"}
        ];

        table = shallow(<PioneerTable pioneers={rows}/>);
    });

    test('shows a list of candidates', () => {
        expect(table.find('.candidate').length)
            .toBe(rows.length);
    });

    test('Has header of Today\'s Pioneers', () => {
        expect(table.find(TableHead).at(0).text())
            .toEqual("Today\'s Pioneers");
    })


})