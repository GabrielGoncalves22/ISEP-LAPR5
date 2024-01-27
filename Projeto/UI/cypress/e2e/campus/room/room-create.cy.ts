import '../../../support/commands';

describe('Create Room', () => {

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

        cy.visit('/campus/room/create');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Create Room');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');
        
        cy.get('input#building').should('exist');
        cy.get('label[for="building"]').invoke('text').should('eq', 'Building Code:');
        
        cy.get('select#floor').should('exist');
        cy.get('label[for="floor"]').invoke('text').should('eq', 'Floor number:');
        
        cy.get('input#name').should('exist');
        cy.get('label[for="name"]').invoke('text').should('eq', 'Name:');
        
        cy.get('input#description').should('exist');
        cy.get('label[for="description"]').invoke('text').should('eq', 'Description:');
        
        cy.get('select#category').should('exist');
        cy.get('label[for="category"]').invoke('text').should('eq', 'Category:');

        cy.get('button[type="submit"]').should('exist').should('have.text', 'Create');
    });

    it('should have an empty form', () => {
        cy.get('#building').should('be.empty');
        cy.get('#floor').should('be.empty');
        cy.get('#name').should('be.empty');
        cy.get('#description').should('be.empty');
        cy.get('#category').should('not.be.selected');
    });

    it('should display the floors after select the building', () => {
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

            cy.get('#building').type(buildingCode);

            cy.wait('@floor-list').then(() => {
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

                floorExpected.forEach((floor) => {
                    cy.get(`option[value="${floor.number}"]`).should('exist').should('not.be.checked').should('have.text', `${floor.number}`);
                });
            });
        });
    });

    it('should display a error message if trying to create a room without a building code', () => {
        cy.get('#name').type('T'.repeat(4));
        cy.get('#category').type('T'.repeat(4));

        cy.get('form').submit();

        cy.get('.form-alert-error').should('have.text', 'Error: The building code is required.');
    });

    it('should display a error message if trying to create a room without select a floor', () => {
        cy.wait('@building-list').then(() => {

            const buildingCode = 'E';

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

            cy.get('#building').type(buildingCode);

            cy.wait('@floor-list').then(() => {
                cy.get('#name').type('T'.repeat(4));
                cy.get('#category').select('Gabinete');

                cy.get('form').submit();
        
                cy.get('.form-alert-error').should('have.text', 'Error: You need to choose one floor.');
            });
        });
    });

    it('should display a error message if trying to create a room without a name', () => {
        cy.wait('@building-list').then(() => {

            const buildingCode = 'E';

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

            cy.get('#building').type(buildingCode);

            cy.wait('@floor-list').then(() => {
                cy.get('#floor').select('1');
                cy.get('form').submit();
        
                cy.get('.form-alert-error').should('have.text', 'Error: The name field cannot be empty.');
            });
        });
    });

    it('should display a error message if trying to create a room without a category', () => {
        cy.wait('@building-list').then(() => {

            const buildingCode = 'E';

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

            cy.get('#building').type(buildingCode);

            cy.wait('@floor-list').then(() => {
                cy.get('#floor').select('1');
                cy.get('#name').type('T'.repeat(4));
                cy.get('form').submit();
        
                cy.get('.form-alert-error').should('have.text', 'Error: The category field cannot be empty.');
            });
        });
    });

    it('should display a error message if the user insert a invalid building code', () => {
        cy.wait('@building-list').then(() => {
            const buildingCode = 'Não existe';
    
            cy.get('#building').type(buildingCode);
        
            cy.get('.form-alert-error').should('have.text', 'Error: Couldn\'t find building by code Não existe.'); 
        });
        
    });

    it('should display a error message if trying to create a room with a invalid name', () => {
        cy.wait('@building-list').then(() => {

            const buildingCode = 'E';

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

            cy.get('#building').type(buildingCode);

            cy.wait('@floor-list').then(() => {
                cy.get('#floor').select('1');
                cy.get('#name').type('T'.repeat(51));
                cy.get('#category').select('Gabinete');

                cy.get('form').submit();
        
                cy.get('.form-alert-error').should('have.text', 'Error: The name of the room cannot have more than 50 characters.');
            });
        });
    });

    it('should display a error message if trying to create a room with a invalid description', () => {
        cy.wait('@building-list').then(() => {

            const buildingCode = 'E';

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

            cy.get('#building').type(buildingCode);

            cy.wait('@floor-list').then(() => {
                cy.get('#floor').select('1');
                cy.get('#name').type('T'.repeat(10));
                cy.get('#description').type('T'.repeat(256));

                cy.get('#category').select('Gabinete');

                cy.get('form').submit();
        
                cy.get('.form-alert-error').should('have.text', 'Error: The description cannot have more than 255 characters.');
            });
        });
    });

    it('should create a room with success', () => {

        // Intercetar post do room
        cy.intercept(
            {
                method: 'POST',
                url: `/api/buildings/rooms`
            },
            {
                statusCode: 200,
                body: {}
            }
        ).as('room-create');

        cy.wait('@building-list').then(() => {

            const buildingCode = 'E';

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

            cy.get('#building').type(buildingCode);

            cy.wait('@floor-list').then(() => {
                cy.get('#floor').select('1');
                cy.get('#name').type('T'.repeat(4));
                cy.get('#category').select('Gabinete');

                cy.get('form').submit();
        
                cy.wait('@room-create').then(() => {
                    cy.get('.form-alert-success').should('have.text', 'Success: The room was successfully created');
                });

            });
        });
    });

});