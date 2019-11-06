import {format} from 'date-fns';

const apiDateFormat = 'yyyy-MM-dd';

context('On the Duty Roster Page', () => {

    describe("Given a chore corral has been prepared for today", () => {

        let corral;
        beforeEach(async () => {
            const pioneers = [
                {name: "Dewy Dooter", id: "10"},
                {name: "Rosy Rosee", id: "11"}
            ];
            const chores = [
                {name: "Burrito builder", description: "Build burritos", id: "101"},
                {name: "Horseshoer", description: "shoe horses", id: "102"}
            ];
            const today = format(new Date(), apiDateFormat);
            corral = {date:  today, pioneers, chores};
            await insertCorral(corral)
        });

        it('all the corral contents will show up', () => {
            cy.visit("http://localhost:8080/roster/");

            corral.pioneers.forEach(pioneer => {
                cy.get(`.duty-pioneer-name[data-pioneer-id=${pioneer.id}]`)
                    .should('to.exist');
            });
            corral.chores.forEach(chore => {
                cy.get(`.duty-chore-name[data-chore-id=${chore.id}]`)
                    .should('to.exist');
            })
        });

    });

    async function insertCorral(corral) {
        await fetch(`http://localhost:8080/api/corral/${corral.date}`, {
            method: "PUT",
            body: JSON.stringify(corral),
            signal: undefined
        });
    }

});