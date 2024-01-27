import '../../../support/commands';

describe('Edit Floor', () => {
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

        cy.visit('/campus/floor/edit');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Edit Floor');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');
        cy.get('#building').should('exist');
        cy.get('#floor').should('exist');
        cy.get('#number').should('exist');
        cy.get('#description').should('exist');
        cy.get('button[type="submit"]').should('exist').should('have.text', 'Edit');
    });

    it('should have an empty form', () => {
        cy.get('#building').should('be.empty');
        cy.get('#floor').should('be.empty');
        cy.get('#number').should('be.empty');
        cy.get('#description').should('be.empty');
    });

    it('should display an error message if editing a floor without selecting a number', () => {
        cy.wait('@building-list').then(() => {
            cy.get('#building').type('A');
            cy.get('form').submit();
            cy.get('.form-alert-error').should('have.text', 'Error: The floor number is required and must be a number.');
        });
    });

    it('should display an error message editing a non-existent building', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

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

            cy.get('#building').type(buildingCode);

            cy.wait('@floor-list-buildingA').then(() => {
                const floorNumber = "0";

                cy.get('#floor').select(floorNumber);

                cy.intercept(
                    {
                        method: 'PUT',
                        url: `/api/buildings/${buildingCode}/floors/${floorNumber}`
                    },
                    {
                        statusCode: 400,
                        body: `Couldn't find building by code ${buildingCode}.`
                    }
                ).as('floor-edit');

                cy.get('#number').clear().type('Arquitetura de edifícios');
                cy.get('form').submit();

                cy.wait('@floor-edit').then(() => {
                    cy.get('.form-alert-error').should('have.text', `Error: Couldn't find building by code ${buildingCode}.`);
                });
            });
        });
    });

    it('should display an error message if editing a floor with number invalid', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

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

            cy.get('#building').type(buildingCode);


            cy.wait('@floor-list-buildingA').then(() => {
                const floorNumber = 0;

                cy.get('#floor').select(floorNumber.toString());

                cy.intercept(
                    {
                        method: 'PUT',
                        url: `/api/buildings/${buildingCode}/floors/${floorNumber}`
                    },
                    {
                        statusCode: 400,
                        body: `The building with the code ${buildingCode} contains the floor number ${floorNumber}.`
                    }
                ).as('floor-edit');

                cy.get('#number').clear().type('Arquitetura de edifícios');
                cy.get('form').submit();

                cy.wait('@floor-edit').then(() => {
                    cy.get('.form-alert-error').should('have.text', `Error: The building with the code ${buildingCode} contains the floor number ${floorNumber}.`);
                });
            });
        });
    });

    it('should display an error message if editing a building with description invalid', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

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

            cy.get('#building').type(buildingCode);

            cy.wait('@floor-list-buildingA').then(() => {
                const floorNumber = 0;

                cy.get('#floor').select(floorNumber.toString());

                cy.intercept(
                    {
                        method: 'PUT',
                        url: `/api/buildings/${buildingCode}/floors/${floorNumber}`
                    },
                    {
                        statusCode: 400,
                        body: 'The description cannot have more than 255 characters.'
                    }
                ).as('floor-edit');

                cy.get('#description').clear().type('A'.repeat(300));
                cy.get('form').submit();

                cy.wait('@floor-edit').then(() => {
                    cy.get('.form-alert-error').should('have.text', 'Error: The description cannot have more than 255 characters.');
                });
            });
        });
    });

    it('should display a success message if editing all fields a floor with valid information and using the put', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

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

            cy.get('#building').type(buildingCode);


            cy.wait('@floor-list-buildingA').then(() => {
                const floorNumber = 0, newFloorNumber = 69;

                cy.get('#floor').select(floorNumber.toString());

                cy.intercept(
                    {
                        method: 'PUT',
                        url: `/api/buildings/${buildingCode}/floors/${floorNumber}`
                    },
                    {
                        statusCode: 200,
                        body: {}
                    }
                ).as('floor-edit');

                cy.get('#number').clear().type(newFloorNumber.toString());
                cy.get('#description').clear().type('A'.repeat(30));
                cy.get('form').submit();

                cy.wait('@floor-edit').then(() => {
                    cy.get('.form-alert-success').should('have.text', 'Success: The floor was successfully edited');
                });
            });
        });
    });

    it('should display a success message if editing one field a floor with valid information and using the patch', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

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

            cy.get('#building').type(buildingCode);

            cy.wait('@floor-list-buildingA').then(() => {
                const floorNumber = -8, newFloorNumber = -69;

                cy.get('#floor').select(floorNumber.toString());

                cy.intercept(
                    {
                        method: 'PUT',
                        url: `/api/buildings/${buildingCode}/floors/${floorNumber}`
                    },
                    {
                        statusCode: 200,
                        body: {}
                    }
                ).as('floor-edit');

                cy.get('#number').clear().type(newFloorNumber.toString());
                cy.get('form').submit();

                cy.wait('@floor-edit').then(() => {
                    cy.get('.form-alert-success').should('have.text', 'Success: The floor was successfully edited');
                });
            });
        });
    });
});