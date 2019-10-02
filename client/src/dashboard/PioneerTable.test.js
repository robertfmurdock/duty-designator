import {shallow} from "enzyme";
import {TableHead, TableRow} from "@material-ui/core";
import Icon from "@mdi/react";
import React from "react";
import PioneerTable from "./PioneerTable";
import {mdiClose} from '@mdi/js';
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";


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

    test('Each candidate has a remove button in last cell position', () => {
            const allRows = table.find(TableBody).find(TableRow);

            allRows.forEach((element) => {
                const lastTableCell = element.find(TableCell).last();
                const icon = lastTableCell.find(Icon);
                expect(icon.length).toBe(1)
                expect(icon.props().path).toBe(mdiClose);
                expect(icon.props().size).toBe(1)
            })

        }
    )


})