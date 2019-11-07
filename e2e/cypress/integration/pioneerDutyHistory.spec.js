import {insertPioneer, removePioneer, setLocalStorageDutyRoster} from "../support/integrationHelpers";
import uuid from 'uuid/v4';

context('on pioneer duty history page', () => {
    describe('relying on database to fetch pioneer', () => {
        const pioneer = {name: "Very Purple Name", id: uuid()};

        before(async function () {
            await insertPioneer(pioneer);
        });

        beforeEach(() => {
            localStorage.clear();
            cy.visit(`http://localhost:8080/pioneer/${pioneer.id}/history`);
        });

        it('shows the fetched pioneer info', () => {
            cy.get(".pioneer-name").should('have.text', pioneer.name);
            cy.get(".lazy-pioneer-msg").should('have.length', 1);
        });

        after(async () => {
            await removePioneer(pioneer)
        });
    });

    describe('relying on localstorage to fetch pioneer and duty history', () => {
        const pioneer = {name: "Very Blue Name", id: uuid()};
        const dyeHairChore = {name: "Dye hair blue", id: uuid()};
        const cosmosaur = {name: "Get yourself to space!", id: uuid()};

        beforeEach(() => {
            localStorage.clear();
            setLocalStorageDutyRoster("10/10/2010", [{pioneer, chore: dyeHairChore}]);
            setLocalStorageDutyRoster("10/11/2010", [{pioneer, chore: dyeHairChore}]);
            setLocalStorageDutyRoster("10/12/2010", [{pioneer, chore: cosmosaur}]);
            cy.visit(`http://localhost:8080/pioneer/${pioneer.id}/history`);
        });

        it('shows pioneer info and list of duties sorted by highest count', () => {
            cy.get(".pioneer-name").should('have.text', pioneer.name);
            cy.get(".lazy-pioneer-msg").should('have.length', 0);
            cy.get(".chore-count-row").should('have.length', 2);

            cy.get(`.chore-count-row[data-chore-id=${dyeHairChore.id}] .chore-name`)
                .should('have.text', dyeHairChore.name);
            cy.get(`.chore-count-row[data-chore-id=${dyeHairChore.id}] .chore-count`)
                .should('have.text', "2");
            cy.get(`.chore-count-row[data-chore-id=${cosmosaur.id}] .chore-name`)
                .should('have.text', cosmosaur.name);
            cy.get(`.chore-count-row[data-chore-id=${cosmosaur.id}] .chore-count`)
                .should('have.text', "1");
        });
    });
});
