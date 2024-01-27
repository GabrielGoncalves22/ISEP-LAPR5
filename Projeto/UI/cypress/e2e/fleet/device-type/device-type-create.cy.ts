import '../../../support/commands';

describe('Create Device Type', () => {
    beforeEach(() => {
        cy.loginFleetManager();
        
        cy.visit('/fleet/deviceType/create');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Create Device Type');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');

        cy.get('#type').should('exist');
        cy.get('label[for="type"]').invoke('text').should('eq', 'Type:');

        cy.get('#brand').should('exist');
        cy.get('label[for="brand"]').invoke('text').should('eq', 'Brand:');

        cy.get('#model').should('exist');
        cy.get('label[for="model"]').invoke('text').should('eq', 'Model:');

        cy.get(':checkbox').should('exist').should('have.length', 2);

        cy.get('button[type="submit"]').should('exist').should('have.text', 'Create');
    });

    it('should have an empty form', () => {
        cy.get('#type').should('be.empty');
        cy.get('#brand').should('be.empty');
        cy.get('#model').should('be.empty');
        cy.get(':checkbox').should('not.be.checked').should('have.length', 2);
    });

    it('should display an error message if creating a device type without filling in the type', () => {
        cy.get('#brand').type('Xiamoi');
        cy.get('#model').type('Vaccuum');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The device type is required.');
    });

    it('should display an error message if creating a device type without filling in the brand', () => {
        cy.get('#type').type('Robot');
        cy.get('#model').type('Vaccuum');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The device type brand is required.');
    });

    it('should display an error message if creating a device type without filling in the model', () => {
        cy.get('#type').type('Robot');
        cy.get('#brand').type('Xiamoi');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The device type model is required.');
    });

    it('should display an error message if creating a device type with type invalid', () => {
        cy.get('#type').type('Robot'.repeat(6));
        cy.get('#brand').type('Xiamoi');
        cy.get('#model').type('Vaccuum');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The type cannot have more than 25 characters.');
    });

    it('should display an error message if creating a device type with brand invalid', () => {
        cy.get('#type').type('Robot');
        cy.get('#brand').type('Xiamoi'.repeat(10));
        cy.get('#model').type('Vaccuum');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The brand cannot have more than 50 characters.');
    });

    it('should display an error message if creating a device type with model invalid', () => {
        cy.get('#type').type('Robot');
        cy.get('#brand').type('Xiamoi');
        cy.get('#model').type('Vaccuum'.repeat(10));
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The model cannot have more than 50 characters.');
    });

    it('should display an error message if creating a device type with type existing', () => {
        cy.intercept(
            {
                method: 'POST',
                url: '/api/devices/types'
            },
            {
                statusCode: 400,
                body: 'The device type already exists!'
            }
        ).as('device-type-create');

        cy.get('#type').type('Robot');
        cy.get('#brand').type('Xiamoi');
        cy.get('#model').type('Vaccuum');
        cy.get('form').submit();

        cy.wait('@device-type-create').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: The device type already exists!');
        });
    });

    it('should display a success message if creating a device type with valid information', () => {
        cy.intercept(
            {
                method: 'POST',
                url: '/api/devices/types'
            },
            {
                statusCode: 201,
                body: {}
            }
        ).as('device-type-create');

        cy.get('#type').type('Robot');
        cy.get('#brand').type('Xiamoi');
        cy.get('#model').type('Vaccuum');
        cy.get('form').submit();

        cy.wait('@device-type-create').then(() => {
            cy.get('.form-alert-success').should('have.text', 'Success: The device type was successfully created');
        });
    });
});
