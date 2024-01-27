import '../../support/commands';

describe('Create Surveillance Task', () => {

    beforeEach(() => {
        cy.loginUser();

        cy.intercept(
            {
                method: 'GET',
                url: '/api/users/me'
            },
            {
                statusCode: 200,
                fixture: 'me-user.json'
            }
        ).as('me');

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

        cy.visit('/task/create/task-surveillance');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Create Surveillance Task');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');

        cy.get('#building').should('exist');
        cy.get('label[for="building"]').invoke('text').should('eq', 'Building Code:');

        cy.get('#emergencyContactName').should('exist');
        cy.get('label[for="emergencyContactName"]').invoke('text').should('eq', 'Emergency Contact Name:');

        cy.get('#emergencyContactNumber').should('exist');
        cy.get('label[for="emergencyContactNumber"]').invoke('text').should('eq', 'Emergency Contact Number:');

        cy.get('button[type="submit"]').should('exist').should('have.text', 'Create');
    });

    it('should have an empty form, except emergency information', () => {
        cy.get('#building').should('be.empty');

        cy.wait('@me').then(() => {
            cy.get('#emergencyContactName').invoke('val').should('not.be.empty');
            cy.get('#emergencyContactNumber').invoke('val').should('not.be.empty');

        });

    });

    it('should have the expected emergency information', () => {
        cy.wait('@me').then(() => {
            cy.get('#emergencyContactName').invoke('val').should('not.be.empty').should('equals', 'André Silva');
            cy.get('#emergencyContactNumber').invoke('val').should('not.be.empty').should('equals', '922435231');

        });
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

    it('should display a error message if creating an task without a building', () => {
        cy.wait('@building-list').then(() => {
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: Building code cannot be empty!');
        });
    });

    it('should display a error message if creating an task without emergency contact name', () => {
        
        cy.wait('@building-list').then(() => {
            cy.get('#building').type('A');
            cy.get('#emergencyContactName').clear();
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: Emergency Contact Name cannot be empty!');
        });
    });

    it('should display a error message if creating an task without emergency contact phone number', () => {
        
        cy.wait('@building-list').then(() => {
            cy.get('#building').type('A');
            cy.get('#emergencyContactName').clear();
            cy.get('#emergencyContactName').type('Teste');
            cy.get('#emergencyContactNumber').clear();
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The phone number cannot be empty!');
        });
    });

    it('should display a error message if creating an task when specifying a emergency contact phone number with a invalid format', () => {
        
        cy.wait('@building-list').then(() => {
            cy.get('#building').type('Não existe');
            cy.get('#emergencyContactName').clear();
            cy.get('#emergencyContactNumber').clear();
            cy.get('#emergencyContactName').type('Teste');
            cy.get('#emergencyContactNumber').type('91 1 22 2333');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The phone number is invalid. It must follow the correct pattern. (eg., 911222333 or 911 222 333)');
        });
    });

    it('should display a error message if creating an task without specifying floors', () => {
        
        cy.wait('@building-list').then(() => {
            cy.get('#building').type('A');
            cy.get('#emergencyContactName').clear();
            cy.get('#emergencyContactNumber').clear();
            cy.get('#emergencyContactName').type('Teste');
            cy.get('#emergencyContactNumber').type('911222333');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: There are no specified floors to verify!');
        });
    });

    it('should display a error message if creating an task when specifying a non existing building', () => {
        
        cy.wait('@building-list').then(() => {
            cy.get('#building').type('Não existe');
            cy.get('#emergencyContactName').clear();
            cy.get('#emergencyContactNumber').clear();
            cy.get('#emergencyContactName').type('Teste');
            cy.get('#emergencyContactNumber').type('911222333');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The selected building does not exist');
        });
    });

    it('should display a success message if creating an surveillance task with valid information', () => {
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
                        url: '/api/tasks/surveillances'
                    },
                    {
                        statusCode: 201,
                        body: {}
                    }
                ).as('surveillance-task-create');

                cy.get('#emergencyContactName').clear();
                cy.get('#emergencyContactNumber').clear();

                cy.get('#emergencyContactName').type('Teste');
                cy.get('#emergencyContactNumber').type('911222333');
                cy.get(`input[value="0"]`).check();
                cy.get(`input[value="1"]`).check();
                cy.get('form').submit();

                cy.wait('@surveillance-task-create').then(() => {
                    cy.get('.form-alert-success').should('have.text', 'Success: The surveillance task was successfully created!');
                });
            });
        });
    });
});
