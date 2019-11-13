import {stubCorral, stubRoster} from "../support/stubs";
import {deleteRoster, deleteToday, insertCorral, insertRoster} from "../support/apiHelpers";
import {assertSaveDisabled, collectDutyIds} from "../page-objects/RosterPage";
import {format} from "date-fns";

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

    describe('visiting specific duty roster', () => {
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

