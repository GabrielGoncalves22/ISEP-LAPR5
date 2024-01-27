import '../../../support/commands';

describe('List All Floors By Building', () => {
    beforeEach(() => {
        cy.loginCampusManager();

        // Intercetar o get de todos os edifícios
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

        cy.visit('/campus/floor/list');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'List Floors');
    });

    it('should have a building input and search button', () => {
        cy.get('#building').should('exist');
        cy.get('.button-style-1').should('have.text', 'Search');
    });

    it('should display an error message if search is performed without selecting an option', () => {
        cy.get('.button-style-1').click();
        cy.get('.form-alert-error').should('have.text', 'Error: You need to choose an option first!');
    });

    it('should display an error message if search is performed without selecting a building', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            // Intercetar o get de um floor de um edifício
            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/floors`
                },
                {
                    statusCode: 404,
                    body: `Couldn\'t find building by code undefined.`
                }
            ).as('floor-list-buildingA');

            cy.get('#allFloors').click();
            cy.get('#building').type(buildingCode);
            cy.get('.button-style-1').click();

            cy.wait('@floor-list-buildingA').then(() => {
                cy.get('.form-alert-error').should('have.text', `Error: Couldn\'t find building by code undefined.`);
            });
            
        });
    });

    it('should display an error message if the search is performed with a non-existent building', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            // Intercetar o get de um floor de um edifício
            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/floors`
                },
                {
                    statusCode: 404,
                    body: `Couldn\'t find building by code ${buildingCode}.`
                }
            ).as('floor-list-buildingA');

            cy.get('#allFloors').click();
            cy.get('#building').type(buildingCode);
            cy.get('.button-style-1').click();

            cy.wait('@floor-list-buildingA').then(() => {
                cy.get('.form-alert-error').should('have.text', `Error: Couldn\'t find building by code ${buildingCode}.`);
            });
        });
    });

    it('should display an error message if the search is performed with a building without floors', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'B';

            // Intercetar o get de um floor de um edifício
            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/floors`
                },
                {
                    statusCode: 404,
                    body: `The building doesn't have floors.`
                }
            ).as('floor-list-buildingA');

            cy.get('#allFloors').click();
            cy.get('#building').type(buildingCode);
            cy.get('.button-style-1').click();

            cy.wait('@floor-list-buildingA').then(() => {
                cy.get('.form-alert-error').should('have.text', `Error: The building doesn't have floors.`);
            });
        });
    });

    it('should perform a successful floor search', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            // Intercetar o get de um floor de um edifício
            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/floors`
                },
                {
                    statusCode: 200,
                    fixture: 'floor-list-buildingA.json'
                }
            ).as('floor-list-buildingA');

            cy.get('#allFloors').click();
            cy.get('#building').type(buildingCode);
            cy.get('.button-style-1').click();

            cy.wait('@floor-list-buildingA').then(() => {
                const floorExpected = [
                    {
                        "number": -8,
                        "description": "test1234"
                    },
                    {
                        "number": -2,
                        "description": "test123"
                    },
                    {
                        "number": 0,
                        "description": "Piso de teste 0"
                    },
                    {
                        "number": 1,
                        "description": "Piso de ferramentas"
                    },
                    {
                        "number": 2,
                        "description": "Piso de fios"
                    },
                    {
                        "number": 5,
                        "description": "Piso de materiais"
                    }
                ];

                cy.get('.list-container').should('exist');
                cy.get('.list-box-body').should('have.length', floorExpected.length);
                floorExpected.forEach((floor, index) => {
                    cy.get('.list-box-body p').eq(index * 2).should('include.text', 'Number: ' + floor.number);
                    cy.get('.list-box-body p').eq(index * 2 + 1).should('include.text', 'Description: ' + floor.description);
                });
            });
        });
    });
});