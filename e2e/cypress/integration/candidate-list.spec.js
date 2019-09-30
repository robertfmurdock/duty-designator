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

});
