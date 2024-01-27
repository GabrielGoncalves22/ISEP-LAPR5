import '../../../support/commands';

describe('Create Elevator', () => {
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

        cy.visit('/campus/elevator/create');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Create Elevator');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');

        cy.get('#building').should('exist');
        cy.get('label[for="building"]').invoke('text').should('eq', 'Building Code:');

        cy.get('#brand').should('exist');
        cy.get('label[for="brand"]').invoke('text').should('eq', 'Brand:');

        cy.get('#model').should('exist');
        cy.get('label[for="model"]').invoke('text').should('eq', 'Model:');

        cy.get('#serialNumber').should('exist');
        cy.get('label[for="serialNumber"]').invoke('text').should('eq', 'Serial number:');

        cy.get('#description').should('exist');
        cy.get('label[for="description"]').invoke('text').should('eq', 'Description:');

        cy.get('button[type="submit"]').should('exist').should('have.text', 'Create');
    });

    it('should have an empty form', () => {
        cy.get('#building').should('be.empty');
        cy.get('#brand').should('be.empty');
        cy.get('#model').should('be.empty');
        cy.get('#serialNumber').should('be.empty');
        cy.get('#description').should('be.empty');
    });

    it('should display the floors after select the building', () => {
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
            ).as('floor-list');

            cy.get('#building').type('A');

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

                floorExpected.forEach((floor) => {
                    cy.get(`input[value="${floor.number}"]`).should('exist').should('not.be.checked');
                });
            });
        });
    });

    it('should display a error message if creating an elevator without a building', () => {
        cy.wait('@building-list').then(() => {
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The building code is required.');
        });
    });

    it('should display a error message if creating an elevator with brand invalid', () => {
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
            ).as('floor-list');

            cy.get('#building').type('A');

            cy.wait('@floor-list').then(() => {
                cy.get('#brand').type('-'.repeat(51));
                cy.get('#model').type('Revit');
                cy.get('#serialNumber').type('ANHVJNW-762');
                cy.get('#description').type('Elevador de Eletrónica');
                cy.get(`input[value="0"]`).check();
                cy.get(`input[value="1"]`).check();
                cy.get('form').submit();

                cy.get('.form-alert-error').should('have.text', 'Error: The elevator brand cannot have more than 50 characters.');
            });
        });
    });

    it('should display a error message if creating an elevator with model invalid', () => {
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
            ).as('floor-list');

            cy.get('#building').type('A');

            cy.wait('@floor-list').then(() => {
                cy.get('#brand').type('Otis');
                cy.get('#model').type('-'.repeat(51));
                cy.get('#serialNumber').type('ANHVJNW-762');
                cy.get('#description').type('Elevador de Eletrónica');
                cy.get(`input[value="0"]`).check();
                cy.get(`input[value="1"]`).check();
                cy.get('form').submit();

                cy.get('.form-alert-error').should('have.text', 'Error: The elevator model cannot have more than 50 characters.');
            });
        });
    });

    it('should display a error message if creating an elevator with brand, but without model', () => {
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
            ).as('floor-list');

            cy.get('#building').type('A');

            cy.wait('@floor-list').then(() => {
                cy.get('#brand').type('Otis');
                cy.get('#serialNumber').type('ANHVJNW-762');
                cy.get('#description').type('Elevador de Eletrónica');
                cy.get(`input[value="0"]`).check();
                cy.get(`input[value="1"]`).check();
                cy.get('form').submit();

                cy.get('.form-alert-error').should('have.text', 'Error: The elevator model is required.');
            });
        });
    });

    it('should display a error message if creating an elevator with serial number invalid', () => {
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
            ).as('floor-list');

            cy.get('#building').type('A');

            cy.wait('@floor-list').then(() => {
                cy.get('#brand').type('Otis');
                cy.get('#model').type('Revit');
                cy.get('#serialNumber').type('-'.repeat(51));
                cy.get('#description').type('Elevador de Eletrónica');
                cy.get(`input[value="0"]`).check();
                cy.get(`input[value="1"]`).check();
                cy.get('form').submit();

                cy.get('.form-alert-error').should('have.text', 'Error: The elevator serial number cannot have more than 50 characters.');
            });
        });
    });

    it('should display a error message if creating an elevator with description invalid', () => {
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
            ).as('floor-list');

            cy.get('#building').type('A');

            cy.wait('@floor-list').then(() => {
                cy.get('#brand').type('Otis');
                cy.get('#model').type('Revit');
                cy.get('#serialNumber').type('ANHVJNW-762');
                cy.get('#description').type('-'.repeat(256));
                cy.get(`input[value="0"]`).check();
                cy.get(`input[value="1"]`).check();
                cy.get('form').submit();

                cy.get('.form-alert-error').should('have.text', 'Error: The description cannot have more than 255 characters.');
            });
        });
    });

    it('should display a error message if creating an elevator with just one floor', () => {
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
            ).as('floor-list');

            cy.get('#building').type('A');

            cy.wait('@floor-list').then(() => {
                cy.get('#brand').type('Otis');
                cy.get('#model').type('Revit');
                cy.get('#serialNumber').type('ANHVJNW-762');
                cy.get('#description').type('Elevador de Eletrónica');
                cy.get('input[value="1"]').check();
                cy.get('form').submit();

                cy.get('.form-alert-error').should('have.text', 'Error: The elevator must serve at least 2 floors.');
            });
        });
    });

    it('should display a error message if creating an elevator with a building without a floor', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'A';

            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/buildings/${buildingCode}/floors`
                },
                {
                    statusCode: 404,
                    body: 'The building doesn\'t have floors.'
                }
            ).as('floor-list');

            cy.get('#building').type('A');

            cy.wait('@floor-list').then(() => {
                cy.get('.form-alert-error').should('have.text', 'Error: The building doesn\'t have floors.');
            });
        });
    });

    it('should display a error message if creating an elevator in a building that already contains an', () => {
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
            ).as('floor-list');

            cy.get('#building').type('A');

            cy.wait('@floor-list').then(() => {

                cy.intercept(
                    {
                        method: 'POST',
                        url: '/api/buildings/elevators'
                    },
                    {
                        statusCode: 400,
                        body: `The building with the code ${buildingCode} already contains an elevator.`
                    }
                ).as('elevator-create');

                cy.get('#brand').type('Otis');
                cy.get('#model').type('Revit');
                cy.get('#serialNumber').type('ANHVJNW-762');
                cy.get('#description').type('Elevador de Eletrónica');
                cy.get('input[value="0"]').check();
                cy.get('input[value="1"]').check();
                cy.get('form').submit();

                cy.wait('@elevator-create').then(() => {
                    cy.get('.form-alert-error').should('have.text', `Error: The building with the code ${buildingCode} already contains an elevator.`);
                });
            });
        });
    });

    it('should display a success message if creating an elevator with valid information', () => {
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
            ).as('floor-list');

            cy.get('#building').type('A');

            cy.wait('@floor-list').then(() => {

                cy.intercept(
                    {
                        method: 'POST',
                        url: '/api/buildings/elevators'
                    },
                    {
                        statusCode: 201,
                        body: {}
                    }
                ).as('elevator-create');

                cy.get('#brand').type('Otis');
                cy.get('#model').type('Revit');
                cy.get('#serialNumber').type('ANHVJNW-762');
                cy.get('#description').type('Elevador de Eletrónica');
                cy.get(`input[value="0"]`).check();
                cy.get(`input[value="1"]`).check();
                cy.get('form').submit();

                cy.wait('@elevator-create').then(() => {
                    cy.get('.form-alert-success').should('have.text', 'Success: The elevator was successfully created');
                });
            });
        });
    });
});
