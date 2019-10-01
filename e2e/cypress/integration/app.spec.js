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
        
        cy.visit('http://localhost:8080')
        cy.get(`.candidate[candidateId=${candidate.id}]`)
          .should('have.text', candidate.name)
    });

    // it('fail', () => {
    //     cy.visit('http://localhost:8080');
    //     cy.get(`.candidate[candidateId="7"]`)
    //         .should('have.text', 'jim joe jon')
    // })

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
        cy.get(`.chore[choreId=${chore.id}]`)
          .should('have.text', chore.name)
    });

    // it('when adding new chore through modal, saving adds new chore',  () => {
    //     const chore = {name: "Rootin' Tootin' Rag Cleanin'", id: uuid()};
    //     insertChore(chore)
    //
    //     cy.visit('http://localhost:8080');
    //     cy.get('.chore').should('have.length', 1)
    //
    //     cy.get('#add-chore-button').click();
    //
    //     cy.get('#chore-name').type(chore.name)
    //     cy.get('#save-chore-button').click();
    //
    //     cy.get(`.chore[choreId=${chore.id}]`)
    //         .should('have.text', chore.name)
    // });

});
