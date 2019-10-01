const uuid = require('uuid/v4');

context('Actions', () => {
    async function insertChore(chore) {
        await fetch("http://localhost:8080/api/chore", {
            method: "POST",
            body: JSON.stringify(chore),
            signal: undefined
        });
    }
    //
    // it('when adding new chore through modal, close does not add new chore',  () => {
    //     const chore = {name: "Testing New Chore Add", id: uuid()};
    //     insertChore(chore)
    //
    //     cy.visit('http://localhost:8080');
    //     cy.get().should('have.length', 1)
    //
    //     cy.get('#add-chore-button').click();
    //     cy.get('#closeModalButton').click();
    //
    //     cy.get('.chore').should('have.length', 0)
    // });

});