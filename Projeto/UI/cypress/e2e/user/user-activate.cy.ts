import '../../support/commands';

describe('Activate User', () => {
    beforeEach(() => {
        cy.loginSystemManager();

        cy.intercept(
            {
                method: 'GET',
                url: '/api/users/role'
            },
            {
                statusCode: 200,
                fixture: 'user-list.json'
            }
        ).as('building-list');

        cy.visit('/user/activate');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Activate/Deactivate User');
    });

    it('should sort the table by Name in ascending order', () => {
        cy.get('th:contains("Name")').click();
        cy.get('th:contains("Name")').should('have.class', 'ascending');
        cy.get('td:nth-child(1)').should('have.text', 'André SilvaBernardo SilvaCristiano RonaldoJoão NevesRúben Dias');
        cy.get('td:nth-child(2)').should('have.text', 'user@isep.ipp.ptsystem@isep.ipp.ptcampus@isep.ipp.pttask@isep.ipp.ptfleet@isep.ipp.pt');
    });

    it('should sort the table by Name in descending order', () => {
        cy.get('th:contains("Name")').click();
        cy.get('th:contains("Name")').click();
        cy.get('th:contains("Name")').should('have.class', 'descending');
        cy.get('td:nth-child(1)').should('have.text', 'Rúben DiasJoão NevesCristiano RonaldoBernardo SilvaAndré Silva');
    });

    it('should sort the table by Email in ascending order', () => {
        cy.get('th:contains("Email")').click();
        cy.get('th:contains("Email")').should('have.class', 'ascending');
        cy.get('td:nth-child(2)').should('have.text', 'campus@isep.ipp.ptfleet@isep.ipp.ptsystem@isep.ipp.pttask@isep.ipp.ptuser@isep.ipp.pt');
    });

    it('should sort the table by Email in descending order', () => {
        cy.get('th:contains("Email")').click();
        cy.get('th:contains("Email")').click();
        cy.get('th:contains("Email")').should('have.class', 'descending');
        cy.get('td:nth-child(2)').should('have.text', 'user@isep.ipp.pttask@isep.ipp.ptsystem@isep.ipp.ptfleet@isep.ipp.ptcampus@isep.ipp.pt');
    });

    it('should sort the table by Telephone in ascending order', () => {
        cy.get('th:contains("Telephone")').click();
        cy.get('th:contains("Telephone")').should('have.class', 'ascending');
        cy.get('td:nth-child(3)').should('have.text', '922404231922404331922405231922435231923404331');
    });

    it('should sort the table by Telephone in descending order', () => {
        cy.get('th:contains("Telephone")').click();
        cy.get('th:contains("Telephone")').click();
        cy.get('th:contains("Telephone")').should('have.class', 'descending');
        cy.get('td:nth-child(3)').should('have.text', '923404331922435231922405231922404331922404231');
    });

    it('should sort the table by Tax Payer Number in ascending order', () => {
        cy.get('th:contains("Tax Payer Number")').click();
        cy.get('th:contains("Tax Payer Number")').should('have.class', 'ascending');
        cy.get('td:nth-child(4)').should('have.text', '152286411');
    });

    it('should sort the table by Tax Payer Number in descending order', () => {
        cy.get('th:contains("Tax Payer Number")').click();
        cy.get('th:contains("Tax Payer Number")').click();
        cy.get('th:contains("Tax Payer Number")').should('have.class', 'descending');
        cy.get('td:nth-child(4)').should('have.text', '152286411');
    });

    it('should sort the table by Role in ascending order', () => {
        cy.get('th:contains("Role")').click();
        cy.get('th:contains("Role")').should('have.class', 'ascending');
        cy.get('td:nth-child(5)').should('have.text', 'Campus ManagerFleet ManagerSystem ManagerTask ManagerUser');
    });

    it('should sort the table by Role in descending order', () => {
        cy.get('th:contains("Role")').click();
        cy.get('th:contains("Role")').click();
        cy.get('th:contains("Role")').should('have.class', 'descending');
        cy.get('td:nth-child(5)').should('have.text', 'UserTask ManagerSystem ManagerFleet ManagerCampus Manager');
    });

    it('should toggle the button color when clicked', () => {
        cy.intercept(
            {
                method: 'PATCH',
                url: '/api/users/activate'
            },
            {
                statusCode: 200,
                body: {
                    "id": "4e0a2e05-2b78-4365-b77a-9d24098e24fe",
                    "name": "Rúben Dias",
                    "email": "fleet@isep.ipp.pt",
                    "telephone": "922404231",
                    "role": "Fleet Manager",
                    "active": false
                }
            }
        ).as('building-list');
        cy.get('tr:first-child button').should('have.css', 'background-color', 'rgb(0, 128, 0)');
        cy.get('tr:first-child button').should('contain.text', 'Activated');

        cy.get('tr:first-child button').click();
      
        cy.get('tr:first-child button').should('contain.text', 'Deactivated');
        cy.get('tr:first-child button').should('have.css', 'background-color', 'rgb(255, 0, 0)');
      });

});