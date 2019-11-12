import {shallow} from "enzyme";
import DutyTable from "./DutyTable";
import React from "react";
import HistoricalRoster from "./HistoricalRoster";
import {Typography} from "@material-ui/core";

describe('HistoricalRoster', function () {
    it('given no duty roster, shows no chores were done message', function () {
        const roster = shallow(<HistoricalRoster dutyRoster={null}/>);
        expect(roster.find(Typography).length).toEqual(1);
    });

    it('given a duty roster, renders the duty roster', () => {
        const roster = shallow(<HistoricalRoster dutyRoster={{duties: 7}}/>);
        expect(roster.find(DutyTable).props().duties).toEqual(7);
    });
});