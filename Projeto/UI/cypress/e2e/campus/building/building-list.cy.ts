import '../../../support/commands';

describe('List Buildings', () => {
    beforeEach(() => {
        cy.loginCampusManager();

        // Intercetar o get de todos os buildings
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

        cy.visit('/campus/building/list');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'List Buildings');
    });

    it('should check the existence of the radio buttons and labels', () => {
        // Check the existence of the first radio button and label
        cy.get('.options-box-option').eq(0).find('input[type="radio"]').should('exist');
        cy.get('.options-box-option').eq(0).find('label[for="allBuilings"]').should('exist');

        // Check the existence of the second radio button, label, and input fields
        cy.get('.options-box-option').eq(1).find('input[type="radio"]').should('exist');
        cy.get('.options-box-option').eq(1).find('label[for="listBetweenMinMax"]').should('exist');
        cy.get('.options-box-option').eq(1).find('input[type="number"]').should('exist');
    });

    it('boxes are empty', () =>{
        cy.get('input#min').should('be.empty');
        cy.get('input#max').should('be.empty');
    });

    it('should display an error if min and max are empty', () => {
        cy.get('#listBetweenMinMax').check();
        cy.get('.option-box-button').find('button.button-style-1').click();
        cy.get('.form-alert-error').should('have.text', 'Error: You need to fill both minimum and maximum number.');
    });

    it('should check if all buildings are listed correctly', () => {
        // Interact with the first option (List all buildings)
        cy.get('#allBuilings').check();
        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings`
            },
            {
                statusCode: 200,
                fixture: 'building-list.json'
            }
        ).as('building-list');

        cy.get('.option-box-button').find('button.button-style-1').click();

        cy.wait('@building-list').then(() => {
            cy.get('.list-container').should('exist');
            cy.get('.list-box').should('have.length', 3);

            // // Check if the expandable list contains specific fields
            // cy.get('.list-box-title').first().click();
            //
            // cy.get('.list-box-body.expanded').first().should('exist');
            //
            // cy.get('.list-box-body.expanded p:contains("Code:")').should('exist');
            // cy.get('.list-box-body.expanded p:contains("Description:")').should('exist');
            // cy.get('.list-box-body.expanded p:contains("Number of X cells:")').should('exist');
            // cy.get('.list-box-body.expanded p:contains("Number of Y cells:")').should('exist');
            // cy.get('.list-box-body.expanded p:contains("Has elevator:")').should('exist');
            // cy.get('.list-box-body.expanded p:contains("Number of floors:")').should('exist');

            cy.fixture('building-list.json').then((fixtureData) => {
                cy.get('.list-box').each(($el, index) => {
                    const building = fixtureData[index];

                    // Expand the item
                    cy.wrap($el).find('.list-box-title').click();

                    // Check if the values in the expandable list match the fixture data
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Code:")').should('have.text', `Code: ${building.code}`);
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Description:")').should('have.text', `Description: ${building.description}`);
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Number of X cells:")').should('have.text', `Number of X cells: ${building.numXCells}`);
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Number of Y cells:")').should('have.text', `Number of Y cells: ${building.numYCells}`);
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Has elevator:")').should('have.text', `Has elevator: ${building.hasElevator}`);
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Number of floors:")').should('have.text', `Number of floors: ${building.numFloors}`);
                });
            });
        });
    });

    it('should check if buildings between min and max are listed correctly', () => {
        // Interact with the second option (List buildings with number of floors between a minimum and maximum)
        cy.get('#listBetweenMinMax').check();
        cy.get('input#min').type('1');
        cy.get('input#max').type('5');

        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings?min=1&max=5`
            },
            {
                statusCode: 200,
                fixture: 'building-list-min-max.json'
            }
        ).as('building-list');

        cy.get('.option-box-button').find('button.button-style-1').click();

        cy.wait('@building-list').then(() => {
            cy.get('.list-container').should('exist');
            cy.get('.list-box').should('have.length', 1);


            cy.fixture('building-list-min-max.json').then((fixtureData) => {
                cy.get('.list-box').each(($el, index) => {
                    const building = fixtureData[index];

                    // Expand the item
                    cy.wrap($el).find('.list-box-title').click();

                    // Check if the values in the expandable list match the fixture data
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Code:")').should('have.text', `Code: ${building.code}`);
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Description:")').should('have.text', `Description: ${building.description}`);
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Number of X cells:")').should('have.text', `Number of X cells: ${building.numXCells}`);
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Number of Y cells:")').should('have.text', `Number of Y cells: ${building.numYCells}`);
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Has elevator:")').should('have.text', `Has elevator: ${building.hasElevator}`);
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Number of floors:")').should('have.text', `Number of floors: ${building.numFloors}`);
                });
            });
        });
    });
});