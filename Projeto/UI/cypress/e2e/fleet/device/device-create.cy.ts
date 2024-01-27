import '../../../support/commands';

describe('Create Device', () => {
    beforeEach(() => {
        cy.loginFleetManager();

        // Intercetar o get de todos os devices
        cy.intercept(
            {
                method: 'POST',
                url: '/api/devices'
            },
            {
                statusCode: 200,
                fixture: 'device-list.json'
            }
        ).as('device-list');

        cy.visit('/fleet/device/create');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Create Device');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');
        cy.get('#code').should('exist');
        cy.get('#description').should('exist');
        cy.get('#nickname').should('exist');
        cy.get('#serialNumber').should('exist');
        cy.get('#deviceType').should('exist');
        cy.get('button[type="submit"]').should('exist').should('have.text', 'Create');
    });

    it(' boxes are empty', () =>{
        cy.get('#code').should('be.empty');
        cy.get('#description').should('be.empty');
        cy.get('#nickname').should('be.empty');
        cy.get('#serialNumber').should('be.empty');
        cy.get('#deviceType').should('be.empty');
    });

    it('should only enable the submit button when required fields are filled', () => {
        cy.get('button[type="submit"]').should('be.disabled');

        cy.get('#code').type('123');
        cy.get('#description').type('Test Description');
        cy.get('#nickname').type('Test Nickname');
        cy.get('#serialNumber').type('123456');
        cy.get('#deviceType').type('Mobile');

        // Check if the button is now enabled
        cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should display an error message if creating a device with an invalid description', () => {
        // Fill in the required fields
        cy.get('#code').type('123');
        cy.get('#description').type('-'.repeat(256));
        cy.get('#nickname').type('Test Nickname');
        cy.get('#deviceType').type('123456');

        // Intercet the post request for creating a device
        cy.intercept(
            {
                method: 'POST',
                url: '/api/devices'
            },
            {
                statusCode: 400,
                body: 'The description cannot have more than 255 characters.'
            }
        ).as('device-create');

        cy.get('form').submit();
        cy.wait('@device-create').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: The description cannot have more than 255 characters.');
        });
    });

    it('should display an error message if creating a device with an invalid nickname', () => {
        // Fill in the required fields
        cy.get('#code').type('123');
        cy.get('#description').type('Test Description');
        cy.get('#serialNumber').type('123456');
        cy.get('#deviceType').type('123456');

        // Intercet the post request for creating a device
        cy.intercept(
            {
                method: 'POST',
                url: '/api/devices'
            },
            {
                statusCode: 400,
                body: 'child "nickname" fails because ["nickname" is not allowed to be empty]'
            }
        ).as('device-create');

        cy.get('form').submit();

        cy.wait('@device-create').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: child "nickname" fails because ["nickname" is not allowed to be empty]')
        });
    });

    it('should display an error message if creating a device with an invalid serial number', () => {
        // Fill in the required fields
        cy.get('#code').type('123');
        cy.get('#description').type('Test Description');
        cy.get('#nickname').type('Test Nickname');
        cy.get('#deviceType').type('123456');

        // Intercet the post request for creating a device
        cy.intercept(
            {
                method: 'POST',
                url: '/api/devices'
            },
            {
                statusCode: 400,
                body: 'child "nickname" fails because ["nickname" is not allowed to be empty]'
            }
        ).as('device-create');

        cy.get('form').submit();

        cy.wait('@device-create').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: child "nickname" fails because ["nickname" is not allowed to be empty]')
        });
    });

    it('should display an error message if creating a device with an invalid device type', () => {
        // Fill in the required fields
        cy.get('#code').type('123');
        cy.get('#description').type('Test Description');
        cy.get('#nickname').type('Test Nickname');
        cy.get('#deviceType').type('123456');

        // Intercet the post request for creating a device
        cy.intercept(
            {
                method: 'POST',
                url: '/api/devices'
            },
            {
                statusCode: 400,
                body: 'Couldn\'t find device type by id 123456.'
            }
        ).as('device-create');

        cy.get('form').submit();

        cy.wait('@device-create').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: Couldn\'t find device type by id 123456.')
        });
    });

    it('should display an success message if creating a device with an valid information', () => {
        // Fill in the required fields
        cy.get('#code').type('123');
        cy.get('#description').type('Test Description');
        cy.get('#nickname').type('Test Nickname');
        cy.get('#serialNumber').type('123456');
        cy.get('#deviceType').type('123456');

        // Intercet the post request for creating a device
        cy.intercept(
            {
                method: 'POST',
                url: '/api/devices'
            },
            {
                statusCode: 201,
                body: {}
            }
        ).as('device-create');

        cy.get('form').submit();

        cy.wait('@device-create').then(() => {
            cy.get('.form-alert-success').should('have.text', 'Success: The device was successfully created')
        });
    });
});