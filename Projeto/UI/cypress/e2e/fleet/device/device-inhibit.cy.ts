import '../../../support/commands';

describe('Inhibit/Disinhibit Device', () => {
    beforeEach(() => {
        cy.loginFleetManager();

        cy.intercept(
            {
                method: 'GET',
                url: '/api/devices'
            },
            {
                statusCode: 200,
                fixture: 'device-list.json'
            }
        ).as('device-list');

        cy.visit('/fleet/device/inhibit');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Inhibit/Disinhibit Device');
    });

    it('should have a device input', () => {
        cy.get('#device').should('exist');
        cy.get('label[for="device"]').invoke('text').should('eq', 'Device Code:');
    });

    it('should have an empty device entry', () => {
        cy.get('#device').should('be.empty');
    });

    it('the button should have a message according to the device status', () => {
        cy.wait('@device-list').then(() => {
            cy.get('#device').type('ABCD1234').blur();
            cy.get('button[type="submit"]').should('exist').should('have.text', 'Inhibit');
        });
    });

    it('the button should have a message according to the device status', () => {
        cy.wait('@device-list').then(() => {
            cy.get('#device').type('PKjtuXHj5').blur();
            cy.get('button[type="submit"]').should('exist').should('have.text', 'Disinhibit');
        });
    });

    it('should display an error message if inhibit a non-existent device', () => {
        cy.wait('@device-list').then(() => {
            const deviceCode = 'ZXCDE';

            cy.intercept(
                {
                    method: 'PATCH',
                    url: `/api/devices/${deviceCode}`
                },
                {
                    statusCode: 404,
                    body: `Couldn\'t find device by code ${deviceCode}.`
                }
            ).as('device-inhibit');

            cy.get('#device').type(deviceCode).blur();
            cy.get('form').submit();

            cy.wait('@device-inhibit').then(() => {
                cy.get('.form-alert-error').should('have.text', `Error: Couldn\'t find device by code ${deviceCode}.`);
            });
        });
    });

    it('should display a success message if inhibit device', () => {
        cy.wait('@device-list').then(() => {
            const deviceCode = 'ABCD1234';

            cy.intercept(
                {
                    method: 'PATCH',
                    url: `/api/devices/${deviceCode}`
                },
                {
                    statusCode: 200,
                    body: {
                        "code": "ABCD1234",
                        "description": "Secondary Device 1",
                        "type": "9951a374-02bb-4ec6-baa3-a9ab71fed5f6",
                        "serialNumber": "XYZ",
                        "nickname": "Sensor1",
                        "status": "Inactive"
                    }
                }
            ).as('device-inhibit');

            cy.get('#device').type(deviceCode).blur();
            cy.get('form').submit();

            cy.wait('@device-inhibit').then(() => {
                cy.get('button[type="submit"]').should('exist').should('have.text', 'Disinhibit');
                cy.get('.form-alert-success').should('have.text', 'Success: The device was successfully inhibited');
            });
        });
    });

    it('should display a success message if disinhibit device', () => {
        cy.wait('@device-list').then(() => {
            const deviceCode = 'PKjtuXHj5';

            cy.intercept(
                {
                    method: 'PATCH',
                    url: `/api/devices/${deviceCode}`
                },
                {
                    statusCode: 200,
                    body: {
                        "code": "PKjtuXHj5",
                        "description": "Main Device",
                        "type": "9951a374-02bb-4ec6-baa3-a9ab71fed5f6",
                        "serialNumber": "Dt",
                        "nickname": "CentralHub",
                        "status": "Active"
                    }
                }
            ).as('device-inhibit');

            cy.get('#device').type(deviceCode).blur();
            cy.get('form').submit();

            cy.wait('@device-inhibit').then(() => {
                cy.get('button[type="submit"]').should('exist').should('have.text', 'Inhibit');
                cy.get('.form-alert-success').should('have.text', 'Success: The device was successfully disinhibited');
            });
        });
    });
});