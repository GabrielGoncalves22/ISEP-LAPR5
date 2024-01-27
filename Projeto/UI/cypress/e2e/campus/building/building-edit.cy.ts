import '../../../support/commands';

describe('Edit Building', () => {
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

        cy.visit('/campus/building/edit');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Edit Building');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');

        cy.get('#building').should('exist');
        cy.get('label[for="building"]').invoke('text').should('eq', 'Building Code:');

        cy.get('#name').should('exist');
        cy.get('label[for="name"]').invoke('text').should('eq', 'Name:');

        cy.get('#description').should('exist');
        cy.get('label[for="description"]').invoke('text').should('eq', 'Description:');

        cy.get('#numXCells').should('exist');
        cy.get('label[for="numXCells"]').invoke('text').should('eq', 'Number of cells in the axis X:');

        cy.get('#numYCells').should('exist');
        cy.get('label[for="numYCells"]').invoke('text').should('eq', 'Number of cells in the axis Y:');

        cy.get('button[type="submit"]').should('exist').should('have.text', 'Edit');
    });

    it('should have an empty form', () => {
        cy.get('#building').should('be.empty');
        cy.get('#name').should('be.empty');
        cy.get('#description').should('be.empty');
        cy.get('#numXCells').should('be.empty');
        cy.get('#numYCells').should('be.empty');
    });

    it('should display an error message if editing a building without changing anything', () => {
        cy.wait('@building-list').then(() => {

            cy.get('#building').type('A');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: No changes detected in the building');
        });
    });

    it('should display an error message editing a non-existent building', () => {
        cy.wait('@building-list').then(() => {

            cy.get('#building').type('AAA');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The selected building does not exist');
        });
    });

    it('should display an error message if editing a building with name invalid', () => {
        cy.wait('@building-list').then(() => {
            cy.get('#building').type('A');
            cy.get('#name').clear().type('Arquitetura de edifícios'.repeat(3));
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The name of the building cannot have more than 50 characters.');
        });
    });

    it('should display an error message if editing a building with description invalid', () => {
        cy.wait('@building-list').then(() => {
            cy.get('#building').type('A');
            cy.get('#description').clear().type('A'.repeat(300));
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The description cannot have more than 255 characters.');
        });
    });

    it('should display an error message if editing a building with number of cells in the axis X invalid', () => {
        cy.wait('@building-list').then(() => {
            cy.get('#building').type('A');
            cy.get('#numXCells').clear().type('-15');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The dimension of the building cannot be equals or less than 0.');
        });
    });

    it('should display an error message if editing a building with number of cells in the axis Y invalid', () => {
        cy.wait('@building-list').then(() => {
            cy.get('#building').type('A');
            cy.get('#numYCells').clear().type('-15');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The dimension of the building cannot be equals or less than 0.');
        });
    });

    it('should display a success message if editing all fields a building with valid information and using the put', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            cy.intercept(
                {
                    method: 'PUT',
                    url: `/api/buildings/${buildingCode}`
                },
                {
                    statusCode: 200,
                    body: {}
                }
            ).as('building-edit');

            cy.get('#building').type(buildingCode);
            cy.get('#name').clear().type('Arquitetura de edifícios');
            cy.get('#description').clear().type('Edifício para os alunos de arquitetura de edifícios');
            cy.get('#numXCells').clear().type('15');
            cy.get('#numYCells').clear().type('20');
            cy.get('form').submit();

            cy.wait('@building-edit').then(() => {
                cy.get('.form-alert-success').should('have.text', 'Success: The building was successfully edited');
            });
        });
    });

    it('should display a success message if editing one field a building with valid information and using the patch', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            cy.intercept(
                {
                    method: 'PATCH',
                    url: `/api/buildings/${buildingCode}`
                },
                {
                    statusCode: 200,
                    body: {}
                }
            ).as('building-edit');

            cy.get('#building').type(buildingCode);
            cy.get('#numXCells').clear().type('30');
            cy.get('form').submit();

            cy.wait('@building-edit').then(() => {
                cy.get('.form-alert-success').should('have.text', 'Success: The building was successfully edited');
            });
        });
    });
});