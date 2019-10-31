import {shallow} from "enzyme";
import DutyTable from "./DutyTable";
import React from "react";
import HistoricalRoster from "./HistoricalRoster";
import {Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import {waitUntil} from "../utilities/testUtils";

describe('HistoricalRoster', function () {
    describe('with no dutyRoster', function () {
        it('shows no chores were done message', function(){
            const roster = shallow(<HistoricalRoster date={new Date()}/>);
            expect(roster.find(Typography).length).toEqual(1);
        });

        it('loads the duty roster from localstorage by date', async () => {
            localStorage.setItem("10/10/2010", JSON.stringify({dutyRoster: 7}));
            const date = new Date(2010, 9, 10, 12, 34, 43);
            const roster = shallow(<HistoricalRoster date={date}/>);

            await waitUntil(() => roster.find(DutyTable).length !== 0);
            expect(roster.find(DutyTable).props().duties).toEqual(7);
        });

        it('shows a link to home if date is today', () => {
            const roster = shallow(<HistoricalRoster date={new Date()}/>);
            expect(roster.find(Link).props().to).toBe("/");
        });

        it('does not show link to home if date is not today', () => {
            const roster = shallow(<HistoricalRoster date={new Date(2010, 10, 10)}/>);
            expect(roster.find(Link).length).toEqual(0);
        })
    })
});