import '../../../support/commands';

describe('List Passageways', () => {

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

        cy.visit('/campus/passageway/list');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'List Passageways');
    });

    it('should check the existence of the radio buttons and labels', () => {
        // Check the existence of the first radio button and label
        cy.get('input[type="radio"]#listAllPassageways').should('exist');
        cy.get('label[for="listAllPassageways"]').invoke('text').should('eq', 'List all passageways');

        // Check the existence of the second radio button, label, and input fields
        cy.get('input[type="radio"]#listPassagewaysBetweenTwoBuildings').should('exist');
        cy.get('label[for="listPassagewaysBetweenTwoBuildings"]').invoke('text').should('eq', 'List passageways between two buildings');

        cy.get('input[type="text"]#building1').should('exist');
        cy.get('input[type="text"]#building2').should('exist');
    });

    it('checkboxes and the inputs are empty', () => {
        cy.get('input#listAllPassageways').should('be.empty');
        cy.get('input#listPassagewaysBetweenTwoBuildings').should('be.empty');
        cy.get('input#building1').should('be.empty');
        cy.get('input#building2').should('be.empty');
    });

    it('should display an error if the checkbox "List passageways between two buildings" is checked and the fields for building 1 and/or building 2 are empty', () => {
        cy.get('#listPassagewaysBetweenTwoBuildings').check();
        cy.get('button[type="button"]').click();
        cy.get('.form-alert-error').should('have.text', 'Error: You need to specify both buildings first.');
    });

    it('should display an error if the checkbox "List passageways between two buildings" is checked and only the field for building 1 is filled', () => {
        cy.get('#listPassagewaysBetweenTwoBuildings').check();
        cy.get('input#building1').type('E');
        cy.get('button[type="button"]').click();
        cy.get('.form-alert-error').should('have.text', 'Error: You need to specify both buildings first.');
    });

    it('should display an error if the checkbox "List passageways between two buildings" is checked and only the field for building 2 is filled', () => {
        cy.get('#listPassagewaysBetweenTwoBuildings').check();
        cy.get('input#building2').type('E');
        cy.get('button[type="button"]').click();
        cy.get('.form-alert-error').should('have.text', 'Error: You need to specify both buildings first.');
    });

    it('should display an error if the checkbox "List passageways between two buildings" is checked and the user insert building 1 and building 2, but they dont have any passageway between them', () => {
        cy.get('#listPassagewaysBetweenTwoBuildings').check();
        cy.get('input#building1').type('Não existe 1');
        cy.get('input#building2').type('Não existe 2');
        cy.get('button[type="button"]').click();
        cy.get('.form-alert-error').should('have.text', 'Error: There isn\'t any created passageways between the buildings Não existe 1 and Não existe 2.');
    });

    it('should display the passageways between two buildings when the checkbox "List passageways between two buildings" is checked and the building 1 and building 2 really have a passageway connecting them', () => {
        // Intercetar o get de todas as passageways
        cy.intercept(
            {
                method: 'GET',
                url: '/api/buildings/passageways?building1=E&building2=A'
            },
            {
                statusCode: 200,
                fixture: 'passageway-list.json'
            }
        ).as('passageway-list');

        cy.get('#listPassagewaysBetweenTwoBuildings').check();
        cy.get('input#building1').type('E');
        cy.get('input#building2').type('A');
        cy.get('button[type="button"]').click();

        cy.wait('@passageway-list').then(() => {

            cy.get('.list-container').should('exist');
            cy.get('.list-box').should('have.length', 3);

            cy.fixture('passageway-list.json').then((fixtureData) => {
                cy.get('.list-box').each(($el, index) => {
                    const passageway = fixtureData[index];

                    // Expand the item
                    cy.wrap($el).find('.list-box-title').click();
                    cy.wrap($el).find('.list-box-title').should('have.text', `Passageway Code: ${passageway.code}`);

                    // Check if the values in the expandable list match the fixture data
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Passageway information:")').should('have.text', `Passageway information:`);
                    cy.wrap($el).find(`.list-box-body.expanded p:contains("From/To Building ${passageway.building1} on the floor number ${passageway.floor1}")`).should('have.text', `From/To Building ${passageway.building1} on the floor number ${passageway.floor1}`);
                    cy.wrap($el).find(`.list-box-body.expanded p:contains("From/To Building ${passageway.building2} on the floor number ${passageway.floor2}")`).should('have.text', `From/To Building ${passageway.building2} on the floor number ${passageway.floor2}`);
                });
            });

        });
    });

    it('should display the passageways between all two buildings when the checkbox "List all passageways" is checked', () => {
        // Intercetar o get de todas as passageways
        cy.intercept(
            {
                method: 'GET',
                url: '/api/buildings/passageways'
            },
            {
                statusCode: 200,
                fixture: 'passageway-list.json'
            }
        ).as('passageway-list');

        cy.get('#listAllPassageways').check();
        cy.get('button[type="button"]').click();

        cy.wait('@passageway-list').then(() => {

            cy.get('.list-container').should('exist');
            cy.get('.list-box').should('have.length', 3);

            cy.fixture('passageway-list.json').then((fixtureData) => {
                cy.get('.list-box').each(($el, index) => {
                    const passageway = fixtureData[index];

                    // Expand the item
                    cy.wrap($el).find('.list-box-title').click();
                    cy.wrap($el).find('.list-box-title').should('have.text', `Passageway Code: ${passageway.code}`);

                    // Check if the values in the expandable list match the fixture data
                    cy.wrap($el).find('.list-box-body.expanded p:contains("Passageway information:")').should('have.text', `Passageway information:`);
                    cy.wrap($el).find(`.list-box-body.expanded p:contains("From/To Building ${passageway.building1} on the floor number ${passageway.floor1}")`).should('have.text', `From/To Building ${passageway.building1} on the floor number ${passageway.floor1}`);
                    cy.wrap($el).find(`.list-box-body.expanded p:contains("From/To Building ${passageway.building2} on the floor number ${passageway.floor2}")`).should('have.text', `From/To Building ${passageway.building2} on the floor number ${passageway.floor2}`);
                });
            });

        });
    });

});
