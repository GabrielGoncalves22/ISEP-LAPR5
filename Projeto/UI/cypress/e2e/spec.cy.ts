import '../support/commands';

describe('My First Test', () => {
    it('Visits the initial project page', () => {
        cy.loginCampusManager();
        
        cy.visit('/home')
        cy.contains('Home')
    })
})
