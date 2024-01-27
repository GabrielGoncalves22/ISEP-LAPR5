describe('Login', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Login');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');

        cy.get('#email').should('exist');
        cy.get('label[for="email"]').invoke('text').should('eq', 'Email:');

        cy.get('#password').should('exist');
        cy.get('label[for="password"]').invoke('text').should('eq', 'Password:');

        cy.get('#showPassword').should('exist');
        cy.get('label[for="showPassword"]').invoke('text').should('eq', 'Show Password');

        cy.get('button[type="submit"]').should('exist').should('have.text', 'Login');
    });

    it('should have an empty form', () => {
        cy.get('#email').should('be.empty');
        cy.get('#password').should('be.empty');
        cy.get('#showPassword').should('not.be.checked');
    });

    it('should display an error message if login without email', () => {
        cy.get('#password').type('Teste@12345');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The email is required.');
    });

    it('should display an error message if login without password', () => {
        cy.get('#email').type('campus@isep.ipp.pt');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The password is required.');
    });

    it('should display a error message if login with a email non-existent', () => {
        const email = 'system@isep.ipp.pt';

        cy.intercept(
            {
                method: 'POST',
                url: '/api/users/login'
            },
            {
                statusCode: 401,
                body: `The user with email ${email} doesn't exists!`
            }
        ).as('login');

        cy.get('#email').type(email);
        cy.get('#password').type('Teste@12345');
        cy.get('form').submit();

        cy.wait('@login',).then(() => {
            cy.get('.form-alert-error').should('have.text', `Error: The user with email ${email} doesn't exists!`);
        });
    });

    it('should display a error message if login with a password incorrect', () => {
        cy.intercept(
            {
                method: 'POST',
                url: '/api/users/login'
            },
            {
                statusCode: 401,
                body: 'Your password is incorrect!'
            }
        ).as('login');

        cy.get('#email').type('system@isep.ipp.pt');
        cy.get('#password').type('Teste@12345');
        cy.get('form').submit();

        cy.wait('@login').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: Your password is incorrect!');
        });
    });

    it('should display a error message if login with a user deactivate', () => {
        cy.intercept(
            {
                method: 'POST',
                url: '/api/users/login'
            },
            {
                statusCode: 401,
                body: 'Your account has not yet been activated by an administrator!'
            }
        ).as('login');

        cy.get('#email').type('system@isep.ipp.pt');
        cy.get('#password').type('Teste@12345');
        cy.get('form').submit();

        cy.wait('@login').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: Your account has not yet been activated by an administrator!');
        });
    });

    it('should advance to menu if login with valid information', () => {
        cy.intercept(
            {
                method: 'POST',
                url: '/api/users/login'
            },
            {
                statusCode: 200,
                fixture: 'login-system-manager.json'
            }
        ).as('login');

        cy.get('#email').type('system@isep.ipp.pt');
        cy.get('#password').type('Teste@12345');
        cy.get('form').submit();

        cy.wait('@login').then(() => {
            cy.url().should('include', '/home');
        });
    });
});
