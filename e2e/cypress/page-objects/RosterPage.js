export function assertSaveDisabled() {
    cy.get("#saved-confirmation").should('have.length', 1);
    cy.get("#save").should('have.length', 0);
}

function getAttribute(el, className, attrName) {
    return el.getElementsByClassName(className)[0]
        .getAttribute(attrName);
}

function getDutyIds(el) {
    const pioneerId = getAttribute(el, 'duty-pioneer-name', 'data-pioneer-id');
    const choreId = getAttribute(el, 'duty-chore-name', 'data-chore-id');
    return {pioneerId, choreId};
}

export function collectDutyIds(duty) {
    return [...duty].map(el => {
        return getDutyIds(el);
    });
}
