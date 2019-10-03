import {shallow} from "enzyme";
import {TableHead, TableRow} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Icon from "@mdi/react";
import React from "react";
import PioneerTable from "./PioneerTable";
import {mdiClose} from '@mdi/js';

describe('Pioneer Table', () => {

    describe('Given a PioneerTable With three pioneers', () => {
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
        });

        test('Each candidate has a remove button in last cell position', () => {
                const allRows = table.find(TableBody).find(TableRow);

                allRows.forEach((element) => {
                    const lastTableCell = element.find(TableCell).last();
                    const icon = lastTableCell.find(Icon);
                    expect(icon.length).toBe(1);
                    expect(icon.props().path).toBe(mdiClose);
                    expect(icon.props().size).toBe(1)
                })
            }
        );
    });

    test('On click remove, wll use remove callback', () => {
        const expectedPioneerToRemove = {id: "uniqueId", name: 'WhereIsRiley'};

        let actualRemovedPioneer = null;
        const removeSpy = (removed) => actualRemovedPioneer = removed;
        const table = shallow(<PioneerTable pioneers={[expectedPioneerToRemove]} onRemove={removeSpy}/>);

        const pioneerRow = table.find(TableBody)
            .find(TableRow)
            .findWhere(row => row.key() === expectedPioneerToRemove.id);

        pioneerRow.find(TableCell).last().find(Icon)
            .simulate("click");

        expect(actualRemovedPioneer).toBe(expectedPioneerToRemove)
    });

});