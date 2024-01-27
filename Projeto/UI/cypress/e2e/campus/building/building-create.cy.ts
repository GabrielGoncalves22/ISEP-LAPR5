import '../../../support/commands';

describe('Create Building', () => {

    beforeEach(() => {
        cy.loginCampusManager();
        cy.visit('/campus/building/create');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Create Building');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');
        
        cy.get('#name').should('exist');
        cy.get('label[for="name"]').invoke('text').should('eq', 'Name:');
        
        cy.get('#code').should('exist');
        cy.get('label[for="code"]').invoke('text').should('eq', 'Code:');
        
        cy.get('#description').should('exist');
        cy.get('label[for="description"]').invoke('text').should('eq', 'Description:');
        
        cy.get('#numXCells').should('exist');
        cy.get('label[for="numXCells"]').invoke('text').should('eq', 'Number of cells in the axis X:');
        
        cy.get('#numYCells').should('exist');
        cy.get('label[for="numYCells"]').invoke('text').should('eq', 'Number of cells in the axis Y:');

        cy.get('button[type="submit"]').should('exist').should('have.text', 'Create');
    });

    it('should have an empty form', () => {
        cy.get('#name').should('be.empty');
        cy.get('#code').should('be.empty');
        cy.get('#description').should('be.empty');
        cy.get('#numXCells').should('be.empty');
        cy.get('#numYCells').should('be.empty');
    });

    it('should display a error message if trying to create a building without the building code', () => {
        cy.get('#numXCells').type('1');
        cy.get('#numYCells').type('1');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The building code is required.');
    });

   it('should display a error message if trying to create a building without the field "Number of cells in the axis X"', () => {
        cy.get('#code').type('T'.repeat(4));
        cy.get('#numYCells').type('1');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The number of X cells must be a number greater than 0.');
    });

    it('should display a error message if trying to create a building without the field "Number of cells in the axis Y"', () => {
        cy.get('#code').type('T'.repeat(4));
        cy.get('#numXCells').type('1');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The number of Y cells must be a number greater than 0.');
    });

    it('should display a error message if trying to create a building with a building code with more than 5 characters', () => {
        cy.get('#code').type('T'.repeat(6));
        cy.get('#numXCells').type('1');
        cy.get('#numYCells').type('1');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The building code cannot have more than 5 characters.');
    });

    it('should display a error message if trying to create a building with a name with more than 50 characters', () => {
        cy.get('#name').type('T'.repeat(51));
        cy.get('#code').type('T'.repeat(4));
        cy.get('#numXCells').type('1');
        cy.get('#numYCells').type('1');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The name of the building cannot have more than 50 characters.');
    });

    it('should display a error message if trying to create a building with a description with more than 255 characters', () => {
        cy.get('#code').type('T'.repeat(4));
        cy.get('#description').type('T'.repeat(256));
        cy.get('#numXCells').type('1');
        cy.get('#numYCells').type('1');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The description cannot have more than 255 characters.');
    });

    it('should display a error message if trying to create a building with a value for the field "Number of cells in the axis X" that is equals or less than 0', () => {
        cy.get('#code').type('T'.repeat(4));
        cy.get('#numXCells').type('0');
        cy.get('#numYCells').type('1');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The dimension of the building cannot be equals or less than 0.');
    });

    it('should display a error message if trying to create a building with a value for the field "Number of cells in the axis Y" that is equals or less than 0', () => {
        cy.get('#code').type('T'.repeat(4));
        cy.get('#numXCells').type('1');
        cy.get('#numYCells').type('0');
        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The dimension of the building cannot be equals or less than 0.');

    });

    it('should display a error message if trying to create a building that already exists.', () => {
        cy.intercept(
            {
                method: 'POST',
                url: `/api/buildings`
            },
            {
                statusCode: 400,
                body: 'The building already exists!'
            }
        ).as('building-create');
        
        cy.get('#code').type('T'.repeat(4));
        cy.get('#numXCells').type('1');
        cy.get('#numYCells').type('1');
        cy.get('form').submit();

        cy.wait('@building-create').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: The building already exists!');
        });
    });

    it('should display a success message if trying to create a building that already exists.', () => {
        cy.intercept(
            {
                method: 'POST',
                url: `/api/buildings`
            },
            {
                statusCode: 200,
                body: {}
            }
        ).as('building-create');
        
        cy.get('#code').type('T'.repeat(4));
        cy.get('#numXCells').type('1');
        cy.get('#numYCells').type('1');
        cy.get('form').submit();

        cy.wait('@building-create').then(() => {
            cy.get('.form-alert-success').should('have.text', 'Success: The building was successfully created');
        });
    });

});
