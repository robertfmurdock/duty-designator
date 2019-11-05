import React from 'react';
import {shallow} from 'enzyme';
import ChoreHistoryTable from "./ChoreHistoryTable";

describe('ChoreHistoryTable', () => {
    it('renders without crashing', () => {
        let pioneer = {name: "Davey Doo", id: "does duties"}

        let table = shallow(<ChoreHistoryTable pioneer={pioneer} choreCounts={[]}/>)
        expect(table.find('.pioneer-name').length).toEqual(1)
    })
});