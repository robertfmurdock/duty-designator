const uuid = require('uuid/v4');

context('Actions', () => {

    async function insertCandidate(candidate) {
        await fetch("http://localhost:8080/api/candidate", {
            method: "POST",
            body: JSON.stringify(candidate),
            signal: undefined
        });
    }

    it('when a new candidate is posted, it shows up on the page',  () => {
        const candidate = {name: "Jimmy Cypress", id: uuid()};
        insertCandidate(candidate);

        cy.visit('http://localhost:8080');
        cy.get(`.candidate[candidateId=${candidate.id}]`, { timeout: 2000})
            .should('have.text', candidate.name)
    });


    async function insertChore(chore) {
        await fetch("http://localhost:8080/api/chore", {
            method: "POST",
            body: JSON.stringify(chore),
            signal: undefined
        });
    }

    it('when a new chore is posted, it shows up on the page',  () => {
        const chore = {name: "Dastardly Dishes", id: uuid()};
        insertChore(chore);

        cy.visit('http://localhost:8080')
        cy.get(`.chore[choreId=${chore.id}]`, { timeout: 2000})
            .should('have.text', chore.name)
    });

});

