import '../../../support/commands';

describe('List All Devices', () => {
    beforeEach(() => {
        cy.loginFleetManager();

        // Intercetar o get de todos os devices
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

        cy.visit('/fleet/device/list');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'List Devices');
    });

    it('should perform a successful device search', () => {
        cy.wait('@device-list').then(() => {

            // Intercetar o get de um device
            cy.intercept(
                {
                    method: 'GET',
                    url: `/api/devices`
                },
                {
                    statusCode: 200,
                    fixture: 'device-list.json'
                }
            ).as('device-list');

            const deviceExpected = [
                {
                    "code": "PKjtuXHj5",
                    "description": "Main Device",
                    "type": "9951a374-02bb-4ec6-baa3-a9ab71fed5f6",
                    "serialNumber": "Dt",
                    "nickname": "CentralHub",
                    "status": "Inactive"
                },
                {
                    "code": "ABCD1234",
                    "description": "Secondary Device 1",
                    "type": "9951a374-02bb-4ec6-baa3-a9ab71fed5f6",
                    "serialNumber": "XYZ",
                    "nickname": "Sensor1",
                    "status": "Active"
                },
                {
                    "code": "EFGH5678",
                    "description": "Secondary Device 2",
                    "type": "9951a374-02bb-4ec6-baa3-a9ab71fed5f6",
                    "serialNumber": "ABC",
                    "nickname": "Sensor2",
                    "status": "Inactive"
                }
            ];

            cy.get('.list-container').should('exist');
            cy.get('.list-box-body').should('have.length', deviceExpected.length);
            deviceExpected.forEach((device, index) => {
                cy.get('.list-box-title p').should('include.text', device.nickname);
                cy.get('.list-box-body p').eq(index * 5).should('include.text', 'Code: ' + device.code);
                cy.get('.list-box-body p').eq(index * 5 + 1).should('include.text', 'Description: ' + device.description);
                cy.get('.list-box-body p').eq(index * 5 + 2).should('include.text', 'Type: ' + device.type);
                cy.get('.list-box-body p').eq(index * 5 + 3).should('include.text', 'SerialNumber: ' + device.serialNumber);
                cy.get('.list-box-body p').eq(index * 5 + 4).should('include.text', 'Status: ' + device.status);
            });
        });
    });
});