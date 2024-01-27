declare namespace Cypress {
    interface Chainable {
        loginSystemManager(): Chainable<void>;
        loginFleetManager(): Chainable<void>;
        loginCampusManager(): Chainable<void>;
        loginTaskManager(): Chainable<void>;
        loginUser(): Chainable<void>;
    }
}

Cypress.Commands.add('loginSystemManager', () => {
    cy.visit('/login')
        .intercept(
            {
                method: 'POST',
                url: '/api/users/login'
            },
            {
                statusCode: 200,
                fixture: 'login-system-manager.json'
            }
        ).as('login')
        .get('#email').type('system@isep.ipp.pt')
        .get('#password').type('Teste@12345')
        .get('form').submit();

    cy.wait('@login');
});

Cypress.Commands.add('loginFleetManager', () => {
    cy.visit('/login')
        .intercept(
            {
                method: 'POST',
                url: '/api/users/login'
            },
            {
                statusCode: 200,
                fixture: 'login-fleet-manager.json'
            }
        ).as('login')
        .get('#email').type('fleet@isep.ipp.pt')
        .get('#password').type('Teste@12345')
        .get('form').submit();

    cy.wait('@login');
});

Cypress.Commands.add('loginCampusManager', () => {
    cy.visit('/login')
        .intercept(
            {
                method: 'POST',
                url: '/api/users/login'
            },
            {
                statusCode: 200,
                fixture: 'login-campus-manager.json'
            }
        ).as('login')
        .get('#email').type('campus@isep.ipp.pt')
        .get('#password').type('Teste@123')
        .get('form').submit();

    cy.wait('@login');
});

Cypress.Commands.add('loginTaskManager', () => {
    cy.visit('/login')
        .intercept(
            {
                method: 'POST',
                url: '/api/users/login'
            },
            {
                statusCode: 200,
                fixture: 'login-task-manager.json'
            }
        ).as('login')
        .get('#email').type('task@isep.ipp.pt')
        .get('#password').type('Teste@12345')
        .get('form').submit();

    cy.wait('@login');
});

Cypress.Commands.add('loginUser', () => {
    cy.visit('/login')
        .intercept(
            {
                method: 'POST',
                url: '/api/users/login'
            },
            {
                statusCode: 200,
                fixture: 'login-user.json'
            }
        ).as('login')
        .get('#email').type('user@isep.ipp.pt')
        .get('#password').type('Teste@12345')
        .get('form').submit();

    cy.wait('@login');
});