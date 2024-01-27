import '../../../support/commands';

describe('List Elevator By Building', () => {
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

        cy.visit('/campus/elevator/list');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'List Elevator By Building');
    });

    it('should have a building input and search button', () => {
        cy.get('#building').should('exist');
        cy.get('label[for="building"]').invoke('text').should('eq', 'Building Code:');

        cy.get('.button-style-1').should('have.text', 'Search');
    });

    it('should have an empty building entry', () => {
        cy.get('#building').should('be.empty');
    });

    it('should display an error message if search is performed without selecting a building', () => {
        cy.get('.button-style-1').click();
        cy.get('.form-alert-error').should('have.text', 'Error: Building code is required');
    });

    it('should display an error message if the search is performed with a non-existent building', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/elevators`
                },
                {
                    statusCode: 404,
                    body: `Couldn\'t find building by code ${buildingCode}.`
                }
            ).as('elevator-list');

            cy.get('#building').type(buildingCode);
            cy.get('.button-style-1').click();

            cy.wait('@elevator-list').then(() => {
                cy.get('.form-alert-error').should('have.text', `Error: Couldn\'t find building by code ${buildingCode}.`);
            });
        });
    });

    it('should display an error message if the search is performed with a building without an elevator', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/elevators`
                },
                {
                    statusCode: 404,
                    body: `The building with the code ${buildingCode} no contains an elevator.`
                }
            ).as('elevator-list');

            cy.get('#building').type(buildingCode);
            cy.get('.button-style-1').click();

            cy.wait('@elevator-list').then(() => {
                cy.get('.form-alert-error').should('have.text', `Error: The building with the code ${buildingCode} no contains an elevator.`);
            });
        });
    });

    it('should perform a successful elevator search', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/elevators`
                },
                {
                    statusCode: 200,
                    fixture: 'elevator-list.json'
                }
            ).as('elevator-list');

            cy.get('#building').type(buildingCode);
            cy.get('.button-style-1').click();

            cy.wait('@elevator-list').then(() => {
                const elevatorExpected = {
                    "buildingCode": "A",
                    "brand": "Otis",
                    "model": "Revit",
                    "serialNumber": "ANHVJNW-762",
                    "floors": [
                        {
                            "number": 10
                        },
                        {
                            "number": 11
                        }
                    ]
                };

                cy.get('.list-container').should('exist');
                cy.get('.list-box-title p').should('include.text', 'Building code: ' + elevatorExpected.buildingCode);
                cy.get('.list-box-body p').should('include.text', 'Brand: ' + elevatorExpected.brand);
                cy.get('.list-box-body p').should('include.text', 'Model: ' + elevatorExpected.model);
                cy.get('.list-box-body p').should('include.text', 'Serial number: ' + elevatorExpected.serialNumber);

                cy.get('.list-box-body p').should('include.text', 'Floors:');
                cy.get('.list-box-body ul li').should('have.length', elevatorExpected.floors.length);
                elevatorExpected.floors.forEach((floor) => {
                    cy.get('.list-box-body ul li').should('include.text', floor.number);
                });
            });
        });
    });
});