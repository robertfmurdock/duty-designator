import {format, subDays} from "date-fns";
import {deleteToday, insertRoster} from "../support/apiHelpers";
import uuid from "uuid/v4";
import {apiDateFormat} from "../support/stubs";

function navDateFormat(date) {
    return format(date, 'MMddyyyy');
}

context('Navigating among rosters', () => {

    describe('when the back button is clicked', () => {
        const yesterday = subDays(new Date(), 1);

        let roster;
        beforeEach(async () => {
            roster = {date: format(yesterday, apiDateFormat), duties: [{pioneer: {id: uuid()}, chore: {id: uuid()}}]};
            await insertRoster(roster)
        });

        beforeEach(() => {
            cy.visit('http://localhost:8080');
            cy.get(".back-btn").click();
        });

        it('will take you to the roster page for yesterday', () => {
            cy.url().should('eq', `http://localhost:8080/roster/${navDateFormat(yesterday)}`);
        });

        it('will take you to the historical roster for today', () => {
            cy.get(".back-btn").click();
            cy.get(".forward-btn").click();
            cy.url().should('eq', `http://localhost:8080/roster/${navDateFormat(yesterday)}`);
        });
    });

    describe('visiting historical duty rosters', () => {
        beforeEach(async function () {
            await deleteToday();
        });

        it('there will be no respin or save buttons', () => {
            cy.visit("http://localhost:8080/roster/10102010");
            cy.get("#respin").should('have.length', 0);
            cy.get("#save").should('have.length', 0);
        });

        it('will redirect user to home if date is today', () => {
            const today = format(new Date(), 'MMddyyyy');
            cy.visit(`http://localhost:8080/roster/${today}`);
            cy.url().should('eq', 'http://localhost:8080/corral');
        });
    });
});
