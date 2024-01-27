import '../../../support/commands';

describe('Edit Passageway', () => {
    beforeEach(() => {
        cy.loginCampusManager();

        // Intercetar o get de todos as passageways
        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings/passageways`
            },
            {
                statusCode: 200,
                fixture: 'passageway-list.json'
            }
        ).as('passageway-list');

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

        let code = 'A';

        // Intercetar o get dos floors do edifício 1
        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings/${code}/floors`
            },
            {
                statusCode: 200,
                fixture: 'floor-list-buildingA.json'
            }
        ).as('floor-list-buildingA');

        code = 'E';

        // Intercetar o get dos floors do edifício 2
        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings/${code}/floors`
            },
            {
                statusCode: 200,
                fixture: 'floor-list-buildingE.json'
            }
        ).as('floor-list-buildingE');

        cy.visit('/campus/passageway/edit');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Edit Passageway');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');
        cy.get('#passageway').should('exist');
        cy.get('#building1').should('exist');
        cy.get('#floor1').should('exist');
        cy.get('#building2').should('exist');
        cy.get('#floor2').should('exist');
        cy.get('button[type="submit"]').should('exist').should('have.text', 'Edit');
    });

    it('should have an empty form', () => {
        cy.get('#passageway').should('be.empty');
        cy.get('#building1').should('be.empty');
        cy.get('#floor1').should('be.empty');
        cy.get('#building2').should('be.empty');
        cy.get('#floor2').should('be.empty');
    });

    it('should display an error message if editing a passageway with code invalid', () => {
        cy.wait('@passageway-list').then(() => {
            const passagewayCode = 'asdf';
            cy.get('#passageway').type(passagewayCode);

            cy.intercept(
                {
                    method: 'PUT',
                    url: `/api/buildings/passageways/${passagewayCode}`
                },
                {
                    statusCode: 400,
                    body: 'Passageway not found'
                }
            ).as('floor-edit');

            cy.get('form').submit();
            cy.wait('@floor-edit').then(() => {
                cy.get('.form-alert-error').should('have.text', 'Error: Passageway not found');
            });
        });
    });
    /*
    it('should display an error message if editing a passageway with building invalid', () => {
        cy.wait('@passageway-list').then(() => {
            const passagewayCode = 'p1';
            cy.get('#passageway').type(passagewayCode);

            cy.wait('@building-list').then(() => {
                const buildingCode = 'asdf';
                cy.get('#building1').type(buildingCode);

                cy.intercept(
                    {
                        method: 'PUT',
                        url: `/api/buildings/passageways/${passagewayCode}`
                    },
                    {
                        statusCode: 400,
                        body: `Couldn't find building by code ${buildingCode}`
                    }
                ).as('floor-edit');

                cy.get('form').submit();
                cy.wait('@floor-edit').then(() => {
                    cy.get('.form-alert-error').should('have.text', `Error: Couldn't find building by code ${buildingCode}`);
                });
            });
        });
    });

    it('should display an error message if editing a passageway with floor number invalid', () => {
        cy.wait('@passageway-list').then(() => {
            const passagewayCode = 'p1';
            cy.get('#passageway').type(passagewayCode);

            cy.wait('@building-list').then(() => {
                const buildingCode = 'A';
                cy.get('#building1').type(buildingCode);

                cy.wait('@floor-list-buildingA').then(() => {
                    const floorCode = 69;
                    cy.get('#floor1').type(floorCode.toString());

                    cy.intercept(
                        {
                            method: 'PUT',
                            url: `/api/buildings/passageways/${passagewayCode}`
                        },
                        {
                            statusCode: 400,
                            body: `Building with code ${buildingCode} does not have floor with ${floorCode} number.`
                        }
                    ).as('floor-edit');

                    cy.get('form').submit();
                    cy.wait('@floor-edit').then(() => {
                        cy.get('.form-alert-error').should('have.text', `Error: Building with code ${buildingCode} does not have floor with ${floorCode} number.`);
                    });
                });
            });
        });
    });

    it('should display a success message if editing all fields a floor with valid information and using the put', () => {
        const passagewayCode = 'p1', building1Code = 'A', floor1Number = 2, building2Code = 'E', floor2Number = 2;

        cy.wait('@passageway-list').then(() => {
            cy.get('#passageway').type(passagewayCode);
            cy.wait('@building-list').then(() => {
                cy.get('#building1').type(building1Code);
                cy.get('#building2').type(building2Code);
                cy.wait('@floor-list-buildingA').then(() => {
                    cy.get('#floor1').type(floor1Number.toString());
                    cy.wait('@floor-list-buildingE').then(() => {
                        cy.get('#floor2').type(floor2Number.toString());

                        cy.intercept(
                            {
                                method: 'PUT',
                                url: `/api/buildings/passageways/${passagewayCode}`
                            },
                            {
                                statusCode: 200,
                                body: {}
                            }
                        ).as('floor-edit');

                        cy.get('form').submit();
                        cy.wait('@floor-edit').then(() => {
                            cy.get('.form-alert-success').should('have.text', 'Success: The passageway was successfully edited');
                        });
                    });
                });
            });
        });
    });

    it('should display a success message if editing one field a floor with valid information and using the patch', () => {
        const passagewayCode = 'p1', building1Code = 'A', floor1Number = 2;

        cy.wait('@passageway-list').then(() => {
            cy.get('#passageway').type(passagewayCode);
            cy.wait('@building-list').then(() => {
                cy.get('#building1').type(building1Code);
                cy.wait('@floor-list-buildingA').then(() => {
                    cy.get('#floor1').type(floor1Number.toString());

                    cy.intercept(
                        {
                            method: 'PUT',
                            url: `/api/buildings/passageways/${passagewayCode}`
                        },
                        {
                            statusCode: 200,
                            body: {}
                        }
                    ).as('floor-edit');
                    
                    cy.get('form').submit();
                    cy.wait('@floor-edit').then(() => {
                        cy.get('.form-alert-success').should('have.text', 'Success: The passageway was successfully edited');
                    });
                });
            });
        });
    });
    */
});