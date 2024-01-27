import '../../../support/commands';

describe('Edit Elevator', () => {
    beforeEach(() => {
        cy.loginCampusManager();
        
        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings`
            },
            {
                statusCode: 200,
                fixture: 'building-list.json'
            }
        ).as('building-list');

        cy.visit('/campus/elevator/edit');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Edit Elevator');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');
        cy.get('#building').should('exist');
        cy.get('#brand').should('exist');
        cy.get('#model').should('exist');
        cy.get('#serialNumber').should('exist');
        cy.get('#description').should('exist');
        cy.get('button[type="submit"]').should('exist').should('have.text', 'Edit');
    });

    it('should have an empty form', () => {
        cy.get('#building').should('be.empty');
        cy.get('#brand').should('be.empty');
        cy.get('#model').should('be.empty');
        cy.get('#serialNumber').should('be.empty');
        cy.get('#description').should('be.empty');
    });

    it('should only enable the edit button when required fields are filled', () => {
        cy.get('button[type="submit"]').should('be.disabled');

        cy.get('#building').type('A');
        cy.get('#brand').type('Bosh');
        cy.get('#model').type('A1');
        cy.get('#serialNumber').type('1234');
        cy.get('#description').type('elevator A1');

        cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should display an error when building doesnt exist', () => {
        cy.get('#building').type('C');

        cy.get('.form-alert-error').should('have.text', 'Error: building does not exist.');
    });


    it('should display an error when building doesnt contain an elevator', () => {

        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings/A/elevators`
            },
            {
                statusCode: 400,
                body: 'building does not contain an elevator.'
            }
        ).as('elevator-list');

        cy.get('#building').type('A');

        cy.wait('@elevator-list').then(() => {
            cy.get('.form-alert-error').should('have.text', 'Error: building does not contain an elevator.');
        });
    });

    it('should fill the fields when given a valid building code', () => {
        cy.intercept(
            {
                method: 'GET',
                url: `/api/buildings/A/elevators`
            },
            {
                statusCode: 200,
                fixture: 'elevator-list.json'
            }
        ).as('elevator-list');

        cy.get('#building').type('A');

        cy.wait('@elevator-list').then(() => {
            // custom assert so it gives time to input the values in the fields
            cy.get('#building').should($input => {
                expect($input.val()).to.not.be.empty;
            });

            cy.get('#brand').should($input => {
                expect($input.val()).to.not.be.empty;
            });

            cy.get('#model').should($input => {
                expect($input.val()).to.not.be.empty;
            });

            cy.get('#serialNumber').should($input => {
                expect($input.val()).to.not.be.empty;
            });

            cy.get('#description').should($input => {
                expect($input.val()).to.not.be.empty;
            });
        });
    });

});