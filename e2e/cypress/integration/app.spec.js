const uuid = require('uuid/v4');

context('Actions', () => {

    async function insertCandidate(candidate) {
        await fetch("http://localhost:8080/api/candidate", {
            method: "POST",
            body: JSON.stringify(candidate),
            signal: undefined
        });
    }

    it('when a new candidate is posted, it shows up on the page', async () => {
        const candidate = {name: "Jimmy Cypress", id: uuid()};
        await insertCandidate(candidate);

        cy.visit('http://localhost:8080');
        cy.get(`.candidate[data-candidate-id=${candidate.id}]`, {timeout: 2000})
            .should('have.text', candidate.name);
    });


    async function insertChore(chore) {
        await fetch("http://localhost:8080/api/chore", {
            method: "POST",
            body: JSON.stringify(chore),
            signal: undefined
        });
    }

    it('when a new chore is posted, it shows up on the page', async () => {
        const chore = {name: "Dastardly Dishes", id: uuid()};
        await insertChore(chore);

        cy.visit('http://localhost:8080');
        cy.get(`.chore[data-chore-id=${chore.id}]`, {timeout: 2000})
            .should('have.text', chore.name);
    });

    // it('Saddle up!',  () => {
    //     cy.visit('http://localhost:8080');

    //     cy.get('#saddle-up').click()
        
    //     cy.get('.results')
    //         .should('have.text', "joe jon");
    // });

});

