import {format, subDays} from "date-fns";
import {insertRoster} from "../support/apiHelpers";
import uuid from "uuid/v4";
import {apiDateFormat} from "../support/stubs";
import {collectDutyIds} from "../page-objects/RosterPage";

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

            checkDutiesAreDisplayed(roster);
        });

        describe('twice', function () {
            const dayBeforeYesterday = subDays(yesterday, 1);
            let roster2;
            beforeEach(async () => {
                roster2 = {
                    date: format(dayBeforeYesterday, apiDateFormat),
                    duties: [{pioneer: {id: uuid()}, chore: {id: uuid()}}]
                };
                await insertRoster(roster2)
            });

            beforeEach(() => {
                cy.get(".back-btn").click();
            });

            it('will take you to the correct roster', () => {
                cy.url().should('eq', `http://localhost:8080/roster/${navDateFormat(dayBeforeYesterday)}`);
                checkDutiesAreDisplayed(roster2);
            });
        });

        describe('twice, and then forward', function () {
            beforeEach(() => {
                cy.get(".back-btn").click();
                cy.get(".forward-btn").click();
            });

            it('will take you to the roster for today', () => {
                cy.url().should('eq', `http://localhost:8080/roster/${navDateFormat(yesterday)}`);
                checkDutiesAreDisplayed(roster);
            });
        });
    });
});

function navDateFormat(date) {
    return format(date, 'MMddyyyy');
}

function checkDutiesAreDisplayed(rosterToCheck) {
    cy.get('.duty').then(duty => {
        const dutyIds = collectDutyIds(duty);
        expect(dutyIds).to.eql(rosterToCheck.duties.map(duty => ({
            pioneerId: duty.pioneer.id,
            choreId: duty.chore.id
        })))
    });
}
