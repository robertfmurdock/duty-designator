import {stubCorral} from "../support/stubs";
import {insertCorral} from "../support/apiHelpers";

context('On the Duty Roster Page', () => {

    describe("Given a chore corral has been prepared for today", () => {

        let corral;
        beforeEach(async () => {
            corral = stubCorral();
            await insertCorral(corral)
        });

        it('all the corral contents will show up', () => {
            cy.visit("http://localhost:8080/roster/");

            corral.pioneers.forEach(pioneer => {
                cy.get(`.duty-pioneer-name[data-pioneer-id=${pioneer.id}]`)
                    .should('to.exist');
            });
            corral.chores.forEach(chore => {
                cy.get(`.duty-chore-name[data-chore-id=${chore.id}]`)
                    .should('to.exist');
            })
        });
    });
});