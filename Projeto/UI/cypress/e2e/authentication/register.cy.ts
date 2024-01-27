import '../../support/commands';

describe('Register', () => {
    beforeEach(() => {
        cy.visit('/register');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Register');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');

        cy.get('#name').should('exist');
        cy.get('label[for="name"]').invoke('text').should('eq', 'Name:');

        cy.get('#email').should('exist');
        cy.get('label[for="email"]').invoke('text').should('eq', 'Email:');

        cy.get('#password').should('exist');
        cy.get('label[for="password"]').invoke('text').should('eq', 'Password:');

        cy.get('#repeatPassword').should('exist');
        cy.get('label[for="repeatPassword"]').invoke('text').should('eq', 'Repeat Password:');

        cy.get('#telephone').should('exist');
        cy.get('label[for="telephone"]').invoke('text').should('eq', 'Telephone Number:');

        cy.get('#taxPayerNumber').should('exist');
        cy.get('label[for="taxPayerNumber"]').invoke('text').should('eq', 'Tax Payer Number:');

        cy.get('button[type="submit"]').should('exist').should('have.text', 'Register');
    });

    it('should have an empty form', () => {
        cy.get('#name').should('be.empty');
        cy.get('#email').should('be.empty');
        cy.get('#password').should('be.empty');
        cy.get('#repeatPassword').should('be.empty');
        cy.get('#telephone').should('be.empty');
        cy.get('#taxPayerNumber').should('be.empty');
    });

    it('should display an error message if creating a user with the repeated password different from the password', () => {
        cy.get('#name').type('Bernardo Silva');
        cy.get('#email').type('system@isep.ipp.pt');
        cy.get('#password').type('Test@12345');
        cy.get('#repeatPassword').type('Test@');
        cy.get('#telephone').type('922404331');
        cy.get('#taxPayerNumber').type('123456789');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: Passwords do not match!');
    });

    it('should display a error message if creating an user without email', () => {
        cy.get('#name').type('Bernardo Silva');
        cy.get('#password').type('Test@12345');
        cy.get('#repeatPassword').type('Test@12345');
        cy.get('#telephone').type('922404331');
        cy.get('#taxPayerNumber').type('123456789');
        cy.get('#consent').check();
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The email is required.');
    });

    it('should display an error message if creating a user without accepting the collection and processing of personal data', () => {
        cy.get('#name').type('Bernardo Silva');
        cy.get('#password').type('Test@12345');
        cy.get('#repeatPassword').type('Test@12345');
        cy.get('#telephone').type('922404331');
        cy.get('#taxPayerNumber').type('123456789');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: It is not possible to continue registration without accepting the collection and processing of your personal data!');
    });

    it('should display a error message if creating an user with existing email', () => {
        const email = 'system@isep.ipp.pt';

        cy.intercept(
            {
                method: 'POST',
                url: '/api/users/register'
            },
            {
                statusCode: 404,
                body: `User already exists with email ${email}!`
            }
        ).as('user-create');

        cy.get('#name').type('Bernardo Silva');
        cy.get('#email').type(email);
        cy.get('#password').type('Test@12345');
        cy.get('#repeatPassword').type('Test@12345');
        cy.get('#telephone').type('922404331');
        cy.get('#taxPayerNumber').type('123456789');
        cy.get('#consent').check();
        cy.get('form').submit();

        cy.wait('@user-create').then(() => {
            cy.get('.form-alert-error').should('have.text', `Error: User already exists with email ${email}!`);
        });
    });

    it('should display a error message if creating an user with existing telephone number', () => {
        const telephone = '922404331';

        cy.intercept(
            {
                method: 'POST',
                url: '/api/users/register'
            },
            {
                statusCode: 404,
                body: `User already exists with telephone number ${telephone}!`
            }
        ).as('user-create');

        cy.get('#name').type('Bernardo Silva');
        cy.get('#email').type('system@isep.ipp.pt');
        cy.get('#password').type('Test@12345');
        cy.get('#repeatPassword').type('Test@12345');
        cy.get('#telephone').type(telephone);
        cy.get('#taxPayerNumber').type('123456789');
        cy.get('#consent').check();
        cy.get('form').submit();

        cy.wait('@user-create').then(() => {
            cy.get('.form-alert-error').should('have.text', `Error: User already exists with telephone number ${telephone}!`);
        });
    });

    it('should display a error message if creating an user with password invalid', () => {
        cy.intercept(
            {
                method: 'POST',
                url: '/api/users/register'
            },
            {
                statusCode: 404,
                body: 'Password doesnt meet criteria [1 uppercase, 1 lowercase, 1 digit, 1 symbol and 10 chars min]!'
            }
        ).as('user-create');

        cy.get('#name').type('Bernardo Silva');
        cy.get('#email').type('system@isep.ipp.pt');
        cy.get('#password').type('Test');
        cy.get('#repeatPassword').type('Test');
        cy.get('#telephone').type('922404331');
        cy.get('#taxPayerNumber').type('123456789');
        cy.get('#consent').check();
        cy.get('form').submit();

        cy.wait('@user-create').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: Password doesnt meet criteria [1 uppercase, 1 lowercase, 1 digit, 1 symbol and 10 chars min]!');
        });
    });

    it('should display a success message if creating an user with valid information', () => {
        cy.intercept(
            {
                method: 'POST',
                url: '/api/users/register'
            },
            {
                statusCode: 201,
                fixture: 'login-system-manager.json'
            }
        ).as('user-create');

        cy.get('#name').type('Bernardo Silva');
        cy.get('#email').type('system@isep.ipp.pt');
        cy.get('#password').type('Test@12345');
        cy.get('#repeatPassword').type('Test@12345');
        cy.get('#telephone').type('922404331');
        cy.get('#taxPayerNumber').type('123456789');
        cy.get('#consent').check();
        cy.get('form').submit();

        cy.wait('@user-create').then(() => {
            cy.get('.form-alert-success').should('have.text', 'Success: Your account has been registered successfully, wait for approval from an administrator!');
        });
    });
});