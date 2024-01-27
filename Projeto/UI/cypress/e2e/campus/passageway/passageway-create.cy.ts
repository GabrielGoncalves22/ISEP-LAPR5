import '../../../support/commands';

describe('Create Passageway', () => {
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

        cy.visit('/campus/passageway/create');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Create Passageway');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');
        cy.get('#building1').should('exist');
        cy.get('#floor1').should('exist');
        cy.get('#building2').should('exist');
        cy.get('#floor2').should('exist');
        cy.get('button[type="submit"]').should('exist').should('have.text', 'Submit');
    });

    it('should have an empty form', () => {
        cy.get('#building1').should('be.empty');
        cy.get('#floor1').should('be.empty');
        cy.get('#building2').should('be.empty');
        cy.get('#floor2').should('be.empty');
    });

    it('should only enable the submit button when required fields are filled', () => {
        cy.get('button[type="submit"]').should('be.disabled');

        cy.get('#building1').type('A');
        cy.get('#floor1').type('1');
        cy.get('#building2').type('E');
        cy.get('#floor2').type('2');
        // Check if the button is now enabled
        cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should display an error if building1 doesnt exist', () => {
        const buildingCode = 'C';

        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings/${buildingCode}/floors`
            },
            {
                statusCode: 400,
                body: `Couldn't find building by code ${buildingCode}.`
            }
        ).as('floor-list');

        cy.get('#building1').type(buildingCode);

        cy.wait('@floor-list').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: Couldn\'t find building by code ' + buildingCode + '.');
        });
    });

    it('should display an error if building2 doesnt exist', () => {
        const buildingCode = 'C';

        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings/${buildingCode}/floors`
            },
            {
                statusCode: 400,
                body: `Couldn't find building by code ${buildingCode}.`
            }
        ).as('floor-list');

        cy.get('#building2').type(buildingCode);

        cy.wait('@floor-list').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: Couldn\'t find building by code ' + buildingCode + '.');
        });
    });

    it('should display the floors1 after select the building1', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            // Intercetar o get dos pisos de um edifício
            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/floors`
                },
                {
                    statusCode: 200,
                    fixture: 'floor-list-buildingA.json'
                }
            ).as('floor-list');

            cy.get('#building1').type('A');

            cy.wait('@floor-list').then(() => {
                const floorExpected =
                    [
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

                floorExpected.forEach((floor, index) => {
                    cy.get('#floor1').select(index);
                    index++;
                    cy.get('#floor1').should('have.value', floor.number.toString());
                });
            });
        });
    });

    it('should display the floors2 after select the building2', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            // Intercetar o get dos pisos de um edifício
            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/floors`
                },
                {
                    statusCode: 200,
                    fixture: 'floor-list-buildingA.json'
                }
            ).as('floor-list');

            cy.get('#building2').type('A');

            cy.wait('@floor-list').then(() => {
                const floorExpected =
                    [
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

                floorExpected.forEach((floor, index) => {
                    cy.get('#floor2').select(index);
                    index++;
                    cy.get('#floor2').should('have.value', floor.number.toString());
                });
            });
        });
    });

    it('should display an error if building1 has no floors', () => {
        const buildingCode = 'B';

        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings/${buildingCode}/floors`
            },
            {
                statusCode: 404,
                body: 'building has no floors.'
            }
        ).as('floor-list');

        cy.get('#building1').type(buildingCode);

        cy.wait('@floor-list').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: building has no floors.');
        });
    });

    it('should display an error if building2 has no floors', () => {
        const buildingCode = 'B';

        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings/${buildingCode}/floors`
            },
            {
                statusCode: 404,
                body: 'building has no floors.'
            }
        ).as('floor-list');

        cy.get('#building2').type(buildingCode);

        cy.wait('@floor-list').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: building has no floors.');
        });
    });

    it('should submit the form successfully with valid data', () => {
        // Fill in valid data for all required fields
        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings/A/floors`
            },
            {
                statusCode: 200,
                fixture: 'floor-list-buildingA.json'
            }
        ).as('floor-listA');

        cy.get('#building1').type('A');

        cy.wait('@floor-listA').then(() => {
            cy.get('#floor1').select(0);
        });

        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings/E/floors`
            },
            {
                statusCode: 200,
                fixture: 'floor-list-buildingE.json'
            }
        ).as('floor-listE');

        cy.get('#building2').type('E');

        cy.wait('@floor-listE').then(() => {
            cy.get('#floor2').select(3);
        });

        cy.intercept(
            {
                method: 'POST',
                url: `/api/buildings/passageways`
            },
            {
                statusCode: 200,
                body: {}
            }
        ).as('floor-create');


        // Submit the form
        cy.get('button[type="submit"]').click();

        cy.get('.form-alert-success').should('exist').should('have.text', 'Success: The passageway was successfully created');
    });
});