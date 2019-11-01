import {format, subDays} from 'date-fns';
const uuid = require('uuid/v4');

context('Actions', () => {
    async function insertCandidate(candidate) {
        await fetch("http://localhost:8080/api/pioneer", {
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
    });

    describe('When we save the spin results', () => {
        const chore = {id: uuid(), name: "Cow tipper", description: "Give some tips to cows", title: 'Tipper'};

        before(function () {
            insertChore(chore);
        });

        beforeEach(function () {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            cy.clock(yesterday.getTime());

            cy.visit('http://localhost:8080');
            cy.get("#saddle-up").click();
            cy.get("#save").click();
        });


        it('has chore title', () => {
            cy.get(`.duty-pioneer-title[data-duty-id=${chore.id}]`, {timeout: 2000})
                .should('have.text', chore.title);
        });

        describe('and reload', function() {
            beforeEach(function() {
                cy.reload();
            });

            it('it still has results table', () => {
                cy.get('.results').should("have.length", 1);
            });

            it('keeps a chore that has been added in the results list', () => {
                cy.get(`.duty-chore-name[data-duty-id=${chore.id}]`, {timeout: 2000})
                    .should('have.text', chore.name);
            });

            it('does not have a save button on reload', () => {
                cy.get('#save').should('have.length', 0);
            });
        });

        it('respin then you can save again', () => {
            cy.get("#respin").click();
            cy.get('#save').should('have.length', 1)
        });

        it('respin, and reload, then the previous spin is remembered', () => {
            cy.get("#respin").click();
            cy.reload();

            cy.get("#save").should('have.length', 0);
        });

        it('respin, reload, respin and you can save again', () => {
            cy.get("#respin").click();
            cy.reload();
            cy.get("#respin").click();

            cy.get("#save").should('have.length', 1);
        });

        describe('and it becomes tomorrow', function() {
            beforeEach(function() {
                cy.clock().then(clock => clock.restore());
                cy.visit('http://localhost:8080');
            });

            it('there is prepare to spin page', function () {
                cy.get("#saddle-up").should('have.length', 1);
            });

            it('can view yesterday', function () {
                cy.get(".back-btn").click();
                cy.get("#saddle-up").should('have.length', 0);
            });
        });
    });
    describe('remove pioneer from candidate list, save and respin', () => {
        const candidate = {name: "Very Unique Name", id: uuid()};

        beforeEach(async function () {
            await insertCandidate(candidate);
        });

        beforeEach(function () {
            cy.visit('http://localhost:8080');
            cy.get(`.delete[data-candidate-id=${candidate.id}]`).click();
            cy.get("#saddle-up").click();
            cy.get("#save").click();
            cy.get("#respin").click();
            cy.visit('http://localhost:8080');
        });

        it('reset will return to duty roster with respin option', () => {
            cy.get("#respin").should('have.length', 1);
            cy.get("#save").should('have.length', 0);
            cy.should('not.contain', candidate.name);
        });
    });

    describe('forward and back buttons', () => {
        const yesterday = format(subDays(new Date(), 1), 'MMddyyyy');

        beforeEach(() => {
            cy.visit('http://localhost:8080');
            cy.get(".back-btn").click();
        });

        it('back button will take you to the historial roster page for yesterday', () => {
            cy.url().should('eq', `http://localhost:8080/roster/${yesterday}`);
        });

        it('will take you to the historical roster for today', () => {
            cy.get(".back-btn").click();
            cy.get(".forward-btn").click();
            cy.url().should('eq', `http://localhost:8080/roster/${yesterday}`);
        });
    });

    describe('visiting historical duty rosters', () => {
        it('there will be no respin or save buttons', () => {
            cy.visit("http://localhost:8080/roster/10102010");
            cy.get("#respin").should('have.length', 0);
            cy.get("#save").should('have.length', 0);
        });

        it('will redirect user to home if date is today', () => {
            const today = format(new Date(), 'MMddyyyy');
            cy.visit(`http://localhost:8080/roster/${today}`);
            cy.url().should('eq', 'http://localhost:8080/');
        });
    });
});

