import '../../support/commands';

describe('Menu', () => {
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

        cy.visit('');
    });

    it('should navigate to the Create Building page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Building').click();
        cy.contains('.sublevel-nav-link', 'Create').click();

        cy.url().should('include', '/campus/building/create');
    });

    it('should navigate to the Edit Building page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Building').click();
        cy.contains('.sublevel-nav-link', 'Edit').click();

        cy.url().should('include', '/campus/building/edit');
    });

    it('should navigate to the List Building page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Building').click();
        cy.contains('.sublevel-nav-link', 'List').click();

        cy.url().should('include', '/campus/building/list');
    });

    /*
    it('should navigate to the Create Floor page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Floor').click();
        cy.contains('.sublevel-nav-link', 'Create').click();

        cy.url().should('include', '/campus/floor/create');
    });

    it('should navigate to the Edit Floor page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Floor').click();
        cy.contains('.sublevel-nav-link', 'Edit').click();

        cy.url().should('include', '/campus/floor/edit');
    });

    it('should navigate to the List Floor page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Floor').click();
        cy.contains('.sublevel-nav-link', 'List').click();

        cy.url().should('include', '/campus/floor/list');
    });

    it('should navigate to the Create Elevator page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Elevator').click();
        cy.contains('.sublevel-nav-link', 'Create').click();

        cy.url().should('include', '/campus/elevator/create');
    });
  
    it('should navigate to the Edit Elevator page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Elevator').click();
        cy.contains('.sublevel-nav-link', 'Edit').click();

        cy.url().should('include', '/campus/elevator/edit');
    });
    */

    it('should navigate to the List Elevator page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Elevator').click();
        cy.contains('.sublevel-nav-link', 'List by building').click();

        cy.url().should('include', '/campus/elevator/list');
    });

    it('should navigate to the Load Map page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Map').click();
        cy.contains('.sublevel-nav-link', 'Load map').click();

        cy.url().should('include', '/campus/map/load');
    });

    /*
    it('should navigate to the Create Passageway page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Passageway').click();
        cy.contains('.sublevel-nav-link', 'Create').click();

        cy.url().should('include', '/campus/passageway/create');
    });

    it('should navigate to the Edit Passageway page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Passageway').click();
        cy.contains('.sublevel-nav-link', 'Edit').click();

        cy.url().should('include', '/campus/passageway/edit');
    });

    it('should navigate to the List Passageway page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Passageway').click();
        cy.contains('.sublevel-nav-link', 'List').click();

        cy.url().should('include', '/campus/passageway/list');
    });

    it('should navigate to the Create Room page with the correct URL', () => {
        cy.contains('.menu-nav-link', 'Campus').click();
        cy.contains('.sublevel-nav-link', 'Room').click();
        cy.contains('.sublevel-nav-link', 'Create').click();

        cy.url().should('include', '/campus/room/create');
    });
    */
});