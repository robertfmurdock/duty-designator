import {stubCorral, stubRoster} from "../support/stubs";
import {deleteRoster, insertCorral, insertRoster} from "../support/apiHelpers";

context('On the Duty Roster Page', () => {

    describe("Given a chore corral but no roster has been prepared for today", () => {
        let corral;

        beforeEach(async () => {
            corral = stubCorral();
            await deleteRoster(corral.date);
            await insertCorral(corral);
        });

        beforeEach(() => {
            cy.visit("http://localhost:8080/roster/");
        });

        it('shows all the corral contents', () => {
            corral.pioneers.forEach(pioneer => {
                cy.get(`.duty-pioneer-name[data-pioneer-id=${pioneer.id}]`)
                    .should('to.exist');
            });
            corral.chores.forEach(chore => {
                cy.get(`.duty-chore-name[data-chore-id=${chore.id}]`)
                    .should('to.exist');
            });
        });

        it('creates a new roster when save is clicked', () => {
            cy.get("#save").click();

            assertSaveDisabled();

            cy.get('.duty').then(duty => {
                const duties = collectDutyIds(duty);
                cy.reload();

                assertSaveDisabled();

                expect(duties).to.deep.eq(collectDutyIds(duty));
            });
        });
    });

    describe('Given that a roster exists for the day', () => {
        let roster;

        beforeEach(async () => {
            roster = stubRoster();
            await insertRoster(roster);
        });

        it('should load the roster instead of the chore corral', () => {
            cy.visit("http://localhost:8080/roster/");

            roster.duties.forEach(duty => {
                cy.get(`.duty-pioneer-name[data-pioneer-id=${duty.pioneer.id}]`)
                    .should('to.exist');
                cy.get(`.duty-chore-name[data-chore-id=${duty.chore.id}]`)
                    .should('to.exist');
            });
        });
    });
});

function assertSaveDisabled() {
    cy.get("#saved-confirmation").should('have.length', 1);
    cy.get("#save").should('have.length', 0);
}

function getAttribute(el, className, attrName) {
    return el.getElementsByClassName(className)[0]
        .getAttribute(attrName);
}

function getDutyIds(el) {
    const pioneerId = getAttribute(el, 'duty-pioneer-name', 'data-pioneer-id');
    const choreId = getAttribute(el, 'duty-chore-name', 'data-chore-id');
    return {pioneerId, choreId};
}

function collectDutyIds(duty) {
    return [...duty].map(el => {
        return getDutyIds(el);
    });
}
