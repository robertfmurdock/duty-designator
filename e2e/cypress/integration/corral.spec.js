import {format} from "date-fns";

context('On the Chore Corral Page', () => {
    describe('Given no duty roster for today', () => {

        beforeEach(() => {
            localStorage.clear();
        });

        it('When visiting corral, we see corral', () => {
            cy.visit('http://localhost:8080/corral');
            cy.get("#saddle-up").should('to.exist');
        });
    });

    describe('Given a duty roster for today', () => {

        beforeEach(() => {
            const date = format(new Date(), 'MM/dd/yyyy');
            localStorage.setItem(date, JSON.stringify({
                dutyRoster: []
            }))
        });

        it('When visiting corral, we see corral', () => {
            cy.visit('http://localhost:8080/corral');
            cy.get("#saddle-up").should('to.exist');
        });
    })
});