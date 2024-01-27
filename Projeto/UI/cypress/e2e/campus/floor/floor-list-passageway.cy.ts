import '../../../support/commands';

describe('List All Floors With Passageway', () => {
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

            // Intercetar o get dos passageways de um floor
            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/floors/passageways`
                },
                {
                    statusCode: 404,
                    body: `Could not find any floors with passageways to other buildings`
                }
            ).as('floor-list-buildingA');

            cy.get('#floorsWithPassageway').click();
            cy.get('#building').type(buildingCode);
            cy.get('.button-style-1').click();

            cy.wait('@floor-list-buildingA').then(() => {
                cy.get('.form-alert-error').should('have.text', `Error: Could not find any floors with passageways to other buildings`);
            });
            
        });
    });

    it('should display an error message if the search is performed with a non-existent building', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'asdfasdf';

            // Intercetar o get dos passageways de um floor
            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/floors/passageways`
                },
                {
                    statusCode: 404,
                    body: `Could not find any floors with passageways to other buildings`
                }
            ).as('floor-list-buildingA');

            cy.get('#floorsWithPassageway').click();
            cy.get('#building').type(buildingCode);
            cy.get('.button-style-1').click();

            cy.wait('@floor-list-buildingA').then(() => {
                cy.get('.form-alert-error').should('have.text', `Error: Could not find any floors with passageways to other buildings`);
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
                    url: `/api/buildings/${buildingCode}/floors/passageways`
                },
                {
                    statusCode: 404,
                    body: `Could not find any floors with passageways to other buildings`
                }
            ).as('floor-list-buildingB');

            cy.get('#floorsWithPassageway').click();
            cy.get('#building').type(buildingCode);
            cy.get('.button-style-1').click();

            cy.wait('@floor-list-buildingB').then(() => {
                cy.get('.form-alert-error').should('have.text', `Error: Could not find any floors with passageways to other buildings`);
            });
        });
    });

    it('should perform a successful floor with passageway search', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            // Intercetar o get de um floor de um edifício
            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/floors/passageways`
                },
                {
                    statusCode: 200,
                    fixture: 'passageway-list-between-two-buildings.json'
                }
            ).as('passageway-list-between-two-buildings');

            cy.get('#floorsWithPassageway').click();
            cy.get('#building').type(buildingCode);
            cy.get('.button-style-1').click();

            cy.wait('@passageway-list-between-two-buildings').then(() => {
                const passagewayExpected = [
                    [
                        {
                            "number": -8,
                            "description": "test123",
                            "building": "E"
                        },
                        {
                            "number": 11222,
                            "description": "Piso de ferramentas",
                            "building": "A"
                        }
                    ],
                    [
                        {
                            "number": 1,
                            "description": "Piso de ferramentas",
                            "building": "E"
                        },
                        {
                            "number": 11,
                            "description": "Piso de ferramentas",
                            "building": "A"
                        }
                    ],
                    [
                        {
                            "number": 10,
                            "description": "Piso de ferramentas",
                            "building": "A"
                        },
                        {
                            "number": 2,
                            "description": "Piso de fios",
                            "building": "E"
                        }
                    ],
                    [
                        {
                            "number": -2,
                            "description": "test123",
                            "building": "E"
                        },
                        {
                            "number": 1,
                            "description": "First Floor",
                            "building": "A"
                        }
                    ]
                ];

                cy.get('.list-container').should('exist');
                cy.get('.list-box-body').should('have.length', passagewayExpected.length);
                passagewayExpected.forEach((passageway, index) => {
                    cy.get('.list-box-body p').eq(index * 6).should('include.text', 'Floor Building: ' + passageway[0].building);
                    cy.get('.list-box-body p').eq(index * 6 + 1).should('include.text', 'Floor Number: ' + passageway[0].number);
                    cy.get('.list-box-body p').eq(index * 6 + 2).should('include.text', 'Floor Description: ' + passageway[0].description);
                    cy.get('.list-box-body p').eq(index * 6 + 3).should('include.text', 'Floor Building: ' + passageway[1].building);
                    cy.get('.list-box-body p').eq(index * 6 + 4).should('include.text', 'Floor Number: ' + passageway[1].number);
                    cy.get('.list-box-body p').eq(index * 6 + 5).should('include.text', 'Floor Description: ' + passageway[1].description);
                });
            });
        });
    });
});