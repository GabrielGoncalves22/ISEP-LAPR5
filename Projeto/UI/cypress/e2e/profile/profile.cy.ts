import '../../support/commands';

describe('Profile tests', () => {

    beforeEach(() => {
        cy.loginUser();

        cy.intercept(
            {
                method: 'GET',
                url: '/api/users/me'
            },
            {
                statusCode: 200,
                fixture: 'me-user.json'
            }
        ).as('me');

        cy.visit('/profile');
        cy.wait('@me');
    });

    // Testes para a edição dos dados
    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'My profile');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');

        cy.get('#name').should('exist');
        cy.get('label[for="name"]').invoke('text').should('eq', 'Name:');

        cy.get('#email').should('exist');
        cy.get('label[for="email"]').invoke('text').should('eq', 'Email:');

        cy.get('#telephone').should('exist');
        cy.get('label[for="telephone"]').invoke('text').should('eq', 'Telephone number:');

        cy.get('#taxPayerNumber').should('exist');
        cy.get('label[for="taxPayerNumber"]').invoke('text').should('eq', 'Tax Payer Number:');

        cy.get('button[type="submit"]').should('exist').should('have.text', 'Edit');
    });

    it('should not have an empty form', () => {
        cy.get('#name').invoke('val').should('not.be.empty');
        cy.get('#telephone').invoke('val').should('not.be.empty');
        cy.get('#taxPayerNumber').invoke('val').should('not.be.empty');
    });

    it('email should be readonly', () => {
        cy.get("#email").should('have.attr', 'readonly');
    });

    it('should display a error message if editing an user with an incorrect telephone number', () => {
        cy.get('#name').clear().type('André Silva Pereira');
        cy.get('#telephone').clear().type('91234');
        cy.get('#taxPayerNumber').clear().type('274800381');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: Telephone is not valid');
    });

    it('should display a error message if editing an user with an incorrect tax payer number', () => {
        cy.get('#name').clear().type('André Silva Pereira');
        cy.get('#telephone').clear().type('912345678');
        cy.get('#taxPayerNumber').clear().type('274800380');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: TaxPayerNumber is not valid');
    });

    it('should display a error message if editing an user with an incorrect name', () => {
        cy.get('#name').clear();
        cy.get('#telephone').clear().type('912345678');
        cy.get('#taxPayerNumber').clear().type('274800380');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The name is required.');
    });

    it('should display a success message if editing an user with valid information', () => {
        cy.intercept(
            {
                method: 'PUT',
                url: '/api/users/profile'
            },
            {
                statusCode: 200,
                fixture: 'me-user.json'
            }
        ).as('user-edit');

        cy.get('#name').clear().type('André Silva Pereira');
        cy.get('#telephone').clear().type('922435231');
        cy.get('#taxPayerNumber').clear().type('152286411');
        cy.get('form').submit();

        cy.wait('@user-edit').then(() => {
            cy.get('.form-alert-success').should('have.text', 'Success: The user was successfully edited');
        });
    });

    // Testes para download de ficheiro
    it('should display the download local', () => {
        cy.get('.large-card').should('exist');
        cy.get('.large-card-header').should('exist');
        cy.get('.large-card-body').should('exist');
        cy.get('.large-card button').should('exist');

        cy.get('.large-card-header').should('contain', 'Download your personal data');
        cy.get('.large-card-body').should('contain', 'You can download your personal data that is used by our web application. Click on the button to download it in a JSON format file.');

        cy.get('.large-card button').contains('Download personal data').should('exist');
    });
});
