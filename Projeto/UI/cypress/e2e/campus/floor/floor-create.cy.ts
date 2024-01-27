import '../../../support/commands';

describe('Create Floor', () => {
    beforeEach(() => {
        cy.loginCampusManager();

        cy.intercept(
            {
                method: 'GET',
                url: '/api/buildings'
            },
            {
                statusCode: 200,
                fixture: 'building-list.json'
            }
        ).as('building-list');

        cy.visit('/campus/floor/create');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Create Floor');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');

        cy.get('#number').should('exist');
        cy.get('label[for="number"]').invoke('text').should('eq', 'Number:');

        cy.get('#description').should('exist');
        cy.get('label[for="description"]').invoke('text').should('eq', 'Description:');

        cy.get('#building').should('exist');
        cy.get('label[for="building"]').invoke('text').should('eq', 'Building Code:');

        cy.get('button[type="submit"]').should('exist').should('have.text', 'Create');
    });

    it('should have an empty form', () => {
        cy.get('#number').should('be.empty');
        cy.get('#description').should('be.empty');
        cy.get('#building').should('be.empty');
    });

    it('should display an error message if creating a floor without filling in the floor number', () => {
        cy.wait('@building-list').then(() => {
            cy.get('#description').type('1º Piso');
            cy.get('#building').type('A');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The floor number is required and must be a number.');
        });
    });

    it('should display an error message if creating a floor with description invalid', () => {
        cy.wait('@building-list').then(() => {
            cy.get('#number').type('1');
            cy.get('#description').type('-'.repeat(256));
            cy.get('#building').type('A');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The description cannot have more than 255 characters.');
        });
    });

    it('should display an error message if creating a floor without filling in the building code', () => {
        cy.wait('@building-list').then(() => {
            cy.get('#number').type('1');
            cy.get('#description').type('1º Piso');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The building code is required.');
        });
    });

    it('should display an error message if creating a floor for a non-existent building', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            cy.intercept(
                {
                    method: 'POST',
                    url: '/api/buildings/floors'
                },
                {
                    statusCode: 400,
                    body: `Couldn\'t find building by code ${buildingCode}.`
                }
            ).as('floor-create');

            cy.get('#number').type('1');
            cy.get('#description').type('1º Piso');
            cy.get('#building').type(buildingCode);
            cy.get('form').submit();

            cy.wait('@floor-create').then(() => {
                cy.get('.form-alert-error').should('have.text', `Error: Couldn\'t find building by code ${buildingCode}.`);
            });
        });
    });

    it('should display an error message if creating a existing floor for a building', () => {
        cy.wait('@building-list').then(() => {
            const floorNumber = '1';
            const buildingCode = 'A';

            cy.intercept(
                {
                    method: 'POST',
                    url: '/api/buildings/floors'
                },
                {
                    statusCode: 400,
                    body: `The floor number ${floorNumber} already exists in the building with the code ${buildingCode}.`
                }
            ).as('floor-create');

            cy.get('#number').type(floorNumber);
            cy.get('#description').type('1º Piso');
            cy.get('#building').type(buildingCode);
            cy.get('form').submit();

            cy.wait('@floor-create').then(() => {
                cy.get('.form-alert-error').should('have.text', `Error: The floor number ${floorNumber} already exists in the building with the code ${buildingCode}.`);
            });
        });
    });

    it('should display a success message if creating a floor with valid information', () => {
        cy.wait('@building-list').then(() => {
            cy.intercept(
                {
                    method: 'POST',
                    url: '/api/buildings/floors'
                },
                {
                    statusCode: 201,
                    body: {}
                }
            ).as('floor-create');

            cy.get('#number').type('1');
            cy.get('#description').type('1º Piso');
            cy.get('#building').type('A');
            cy.get('form').submit();

            cy.wait('@floor-create').then(() => {
                cy.get('.form-alert-success').should('have.text', 'Success: The floor was successfully created');
            });
        });
    });
});
