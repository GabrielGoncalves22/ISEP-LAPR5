import '../../../support/commands';

describe('Load Map', () => {
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

        cy.visit('/campus/map/load');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Upload building floor map');
    });

    it('should display the input fields', () => {
        cy.get('input#building').should('exist');
        cy.get('label[for="building"]').invoke('text').should('eq', 'Building Code:');
        
        cy.get('select#floor').should('exist');
        cy.get('label[for="floor"]').invoke('text').should('eq', 'Floor number:');
        
        cy.get('input#file').should('exist');
        cy.get('label[for="file"]').invoke('text').should('eq', 'File');


        cy.get('button[type="button"]').should('exist').should('have.text', 'Send');
    });

    it('should have an empty form', () => {
        cy.get('#building').should('be.empty');
        cy.get('#floor').should('be.empty');
        cy.get('#file').should('be.empty');
    });

    it('should display a error message if trying to load a floor map without choosing a bulding', () => {
        cy.get('button[type="button"]').click();

        cy.get('.form-alert-error').should('have.text', 'Error: Please, choose a building.');
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
                    cy.get(`option[value="${floor.number}"]`).should('exist').should('not.be.checked').should('have.text', `${floor.number}`);
                });
            });
        });
    });

    it('should display a error message if trying to load a floor map without choosing a floor', () => {
        
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
                
                cy.get('button[type="button"]').click();
        
                cy.get('.form-alert-error').should('have.text', 'Error: Please, choose the floor of the building.');
            });
        });
        
    });

    it('should display a error message if trying to load a floor map without choosing a file', () => {
        
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
    
            cy.get('#building').type('E');
            
            cy.wait('@floor-list').then(() => {
                cy.get('#floor').select('1');
                
                cy.get('button[type="button"]').click();
        
                cy.get('.form-alert-error').should('have.text', 'Error: Please, select a file.');
            });
        });
        
    });

    it('should display a error message if the user insert a invalid building code', () => {
        
        const buildingCode = 'Não existe';

        cy.get('#building').type(buildingCode);
    
        cy.get('.form-alert-error').should('have.text', 'Error: Couldn\'t find building by code Não existe.');
        
    });

    it('should present the errors found in the file', () => {
        const buildingCode = 'E';
        
        cy.wait('@building-list').then(() => {

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
    
            cy.get('#building').type('E');
            
            cy.wait('@floor-list').then(() => {
                cy.get('#floor').select('1');
                cy.get('#file').selectFile('cypress/e2e/campus/map/files/invalid_map.json');
                
                cy.get('button[type="button"]').click();
        
                cy.get('.form-alert-error').should('have.text', 'Error: The X dimensions doesn\'t match!');
            });
        });
    });

    it('should load the floor map', () => {
        const buildingCode = 'E';

        // Intercetar o get dos pisos de um edifício
        cy.intercept(
            {
                method: 'PATCH',
                url: `/api/buildings/${buildingCode}/floors/1/map`
            },
            {
                statusCode: 200
            }
        ).as('floor-list');
        
        cy.wait('@building-list').then(() => {

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
    
            cy.get('#building').type('E');
            
            cy.wait('@floor-list').then(() => {
                cy.get('#floor').select('1');
                cy.get('#file').selectFile('cypress/e2e/campus/map/files/map.json');
                
                cy.get('button[type="button"]').click();
        
            });
        });
    });

});