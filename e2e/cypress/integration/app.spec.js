const uuid = require('uuid/v4');

context('Actions', () => {

    async function insertCandidate(candidate) {
        await fetch("http://localhost:8080/api/candidate", {
            method: "POST",
            body: JSON.stringify(candidate),
            signal: undefined
        });
    }

    describe('when a new candidate is posted', function () {

        const candidate = {name: "Jimmy Cypress", id: uuid()};

        beforeEach(async function () {
            await insertCandidate(candidate);
        });

        beforeEach(() => cy.wait(40));

        it('it shows up on the page', () => {
            cy.visit('http://localhost:8080');
            cy.get(`.candidate[data-candidate-id=${candidate.id}]`, {timeout: 2000})
                .should('have.text', candidate.name);
        });
    });

    async function insertChore(chore) {
        await fetch("http://localhost:8080/api/chore", {
            method: "POST",
            body: JSON.stringify(chore),
            signal: undefined
        });
    }


    describe('when a new chore is posted', () => {
        const chore = {name: "Dastardly Dishes", id: uuid()};

        beforeEach(async () => {
            await insertChore(chore);
        });

        beforeEach(() => cy.wait(40));

        it('it shows up on the page', () => {
            cy.visit('http://localhost:8080');
            cy.get(`.chore[data-chore-id=${chore.id}]`, {timeout: 2000})
                .should('have.text', chore.name);
        });
    })

});

