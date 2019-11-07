import {format} from "date-fns";
import {apiDateFormat, stubCorral} from "../support/stubs";
import {deleteCorral, insertCorral} from "../support/apiHelpers";
import {insertPioneer, insertChore} from "../support/integrationHelpers";

const uuid = require('uuid/v4');

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
    });

    describe('Given a chore corral for today already exists', () => {
        let corral;
        beforeEach(async () => {
            corral = stubCorral();
            await insertCorral(corral)
        });

        it('all the corral contents will show up', () => {
            cy.visit("http://localhost:8080/corral");

            corral.pioneers.forEach(pioneer => {
                cy.get(`.pioneer-name[data-pioneer-id=${pioneer.id}]`)
                    .should('to.exist');
            });
            corral.chores.forEach(chore => {
                cy.get(`.chore-name[data-chore-id=${chore.id}]`)
                    .should('to.exist');
            })
        });
    });

    describe('Given a chore corral for today does not exist', () => {
        let newChore, newPioneer;
        beforeEach(async () => {
            const today = format(new Date(), apiDateFormat);

            newPioneer = {id: uuid(), name: "Nat-fail"};
            newChore = {id: uuid(), name: 'Success'};
            await Promise.all([
                deleteCorral(today),
                insertPioneer(newPioneer),
                insertChore(newChore)
            ])
        });

        it('standard pioneers and chores show up', () => {
            cy.visit("http://localhost:8080/corral");

            cy.get(`.pioneer-name[data-pioneer-id=${newPioneer.id}]`)
                .should('to.exist');
            cy.get(`.chore-name[data-chore-id=${newChore.id}]`)
                .should('to.exist');
        });
    })
});