import {format} from "date-fns";
import {apiDateFormat, stubCorral, stubRoster} from "../support/stubs";
import {deleteCorral, insertCorral, insertRoster} from "../support/apiHelpers";
import {insertPioneer, insertChore, removeChore, removePioneer} from "../support/apiHelpers";

const uuid = require('uuid/v4');

context('On the Chore Corral Page', () => {
    describe('Given no duty roster for today', () => {

        it('When visiting corral, we see corral', () => {
            cy.visit('http://localhost:8080/corral');
            cy.get("#saddle-up").should('to.exist');
        });
    });

    describe('Given a duty roster for today', () => {

        beforeEach(async () => {
            await insertRoster(stubRoster())
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
                cy.get(`.corral-card[data-corral-id=${pioneer.id}]`)
                    .should('to.exist');
            });
            corral.chores.forEach(chore => {
                cy.get(`.corral-card[data-corral-id=${chore.id}]`)
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

            cy.get(`.corral-card[data-corral-id=${newPioneer.id}]`)
                .should('to.exist');
            cy.get(`.corral-card[data-corral-id=${newChore.id}]`)
                .should('to.exist');
        });

        afterEach(async () => {
            await removePioneer(newPioneer);
            await removeChore(newChore);
        });
    });

    describe('For the Add Chore Button', () => {
        it('exists on the corral page', () => {
            cy.visit("http://localhost:8080/corral")
            cy.get(`.open-add-chore-modal-button`).should('to.exist');
        })
    });

});