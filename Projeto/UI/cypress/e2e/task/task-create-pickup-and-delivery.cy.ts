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
                url: '/api/buildings/rooms'
            },
            {
                statusCode: 200,
                fixture: 'room-list.json'
            }
        ).as('room-list');

        cy.visit('/task/create/task-pickup-and-delivery');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Create Pickup And Delivery Task');
    });

    it('should display the form', () => {
        cy.get('form').should('exist');

        cy.get('#pickupRoomName').should('exist');
        cy.get('label[for="pickupRoomName"]').invoke('text').should('eq', 'Pickup Room:');

        cy.get('#deliveryRoomName').should('exist');
        cy.get('label[for="deliveryRoomName"]').invoke('text').should('eq', 'Delivery Room:');

        cy.get('#pickupContactName').should('exist');
        cy.get('label[for="pickupContactName"]').invoke('text').should('eq', 'Pickup Contact Name:');

        cy.get('#pickupContactPhoneNumber').should('exist');
        cy.get('label[for="pickupContactPhoneNumber"]').invoke('text').should('eq', 'Pickup Contact Phone Number:');

        cy.get('#deliveryContactName').should('exist');
        cy.get('label[for="deliveryContactName"]').invoke('text').should('eq', 'Delivery Contact Name:');

        cy.get('#deliveryContactPhoneNumber').should('exist');
        cy.get('label[for="deliveryContactPhoneNumber"]').invoke('text').should('eq', 'Delivery Contact Phone Number:');

        cy.get('#taskDescription').should('exist');
        cy.get('label[for="taskDescription"]').invoke('text').should('eq', 'Task Description:');

        cy.get('#confirmationCode').should('exist');
        cy.get('label[for="confirmationCode"]').invoke('text').should('eq', 'Confirmation Code:');

        cy.get('button[type="submit"]').should('exist').should('have.text', 'Create Task');
    });

    it('should have an empty form, except contact information', () => {
        cy.get('#pickupRoomName').should('be.empty');
        cy.get('#deliveryRoomName').should('be.empty');
        cy.get('#taskDescription').should('be.empty');
        cy.get('#confirmationCode').should('be.empty');

        cy.wait('@me').then(() => {
            cy.get('#pickupContactName').invoke('val').should('not.be.empty');
            cy.get('#pickupContactPhoneNumber').invoke('val').should('not.be.empty');
            cy.get('#deliveryContactName').invoke('val').should('not.be.empty');
            cy.get('#deliveryContactPhoneNumber').invoke('val').should('not.be.empty');
        });

    });

    it('should have the expected contact information', () => {
        cy.wait('@me').then(() => {
            cy.get('#pickupContactName').invoke('val').should('not.be.empty').should('equals', 'André Silva');
            cy.get('#pickupContactPhoneNumber').invoke('val').should('not.be.empty').should('equals', '922435231');
            cy.get('#deliveryContactName').invoke('val').should('not.be.empty').should('equals', 'André Silva');
            cy.get('#deliveryContactPhoneNumber').invoke('val').should('not.be.empty').should('equals', '922435231');
        });
    });

    it('should display a error message if creating an task without a Pickup Room', () => {
        cy.wait('@room-list').then(() => {
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The Pickup Room field is required!');
        });
    });

    it('should display a error message if creating an task without a Delivery Room', () => {
        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('E101');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The Delivery Room field is required!');
        });
    });

    it('should display a error message if creating an task without a Pickup Contact Name', () => {
        cy.get('#pickupContactName').clear();
        cy.get('#pickupContactPhoneNumber').clear();
        cy.get('#deliveryContactName').clear();
        cy.get('#deliveryContactPhoneNumber').clear();

        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('E101');
            cy.get('#deliveryRoomName').type('A101');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The Pickup Contact Name field is required!');
        });
    });

    it('should display a error message if creating an task without a Pickup Contact Phone Number', () => {
        cy.get('#pickupContactName').clear();
        cy.get('#pickupContactPhoneNumber').clear();
        cy.get('#deliveryContactName').clear();
        cy.get('#deliveryContactPhoneNumber').clear();

        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('E101');
            cy.get('#deliveryRoomName').type('A101');
            cy.get('#pickupContactName').type('André Silva');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The Pickup Contact Phone Number field is required!');
        });
    });

    it('should display a error message if creating an task without a Delivery Contact Name', () => {
        cy.get('#pickupContactName').clear();
        cy.get('#pickupContactPhoneNumber').clear();
        cy.get('#deliveryContactName').clear();
        cy.get('#deliveryContactPhoneNumber').clear();

        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('E101');
            cy.get('#deliveryRoomName').type('A101');
            cy.get('#pickupContactName').type('André Silva');
            cy.get('#pickupContactPhoneNumber').type('922435231');
            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The Delivery Contact Name field is required!');
        });
    });

    it('should display a error message if creating an task without a Delivery Contact Phone Number', () => {
        cy.get('#pickupContactName').clear();
        cy.get('#pickupContactPhoneNumber').clear();
        cy.get('#deliveryContactName').clear();
        cy.get('#deliveryContactPhoneNumber').clear();

        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('E101');
            cy.get('#deliveryRoomName').type('A101');
            cy.get('#pickupContactName').type('André Silva');
            cy.get('#pickupContactPhoneNumber').type('922435231');
            cy.get('#deliveryContactName').type('André Silva');

            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The Delivery Contact Phone Number field is required!');
        });
    });

    it('should display a error message if creating an task without a Confirmation Code', () => {
        cy.get('#pickupContactName').clear();
        cy.get('#pickupContactPhoneNumber').clear();
        cy.get('#deliveryContactName').clear();
        cy.get('#deliveryContactPhoneNumber').clear();

        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('E101');
            cy.get('#deliveryRoomName').type('A101');
            cy.get('#pickupContactName').type('André Silva');
            cy.get('#pickupContactPhoneNumber').type('922435231');
            cy.get('#deliveryContactName').type('André Silva');
            cy.get('#deliveryContactPhoneNumber').type('922435231');

            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The Confirmation Code field is required!');
        });
    });

    it('should display a error message if creating an task with a pickup room that does not exists in the system', () => {
        cy.get('#pickupContactName').clear();
        cy.get('#pickupContactPhoneNumber').clear();
        cy.get('#deliveryContactName').clear();
        cy.get('#deliveryContactPhoneNumber').clear();

        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('Não existe');
            cy.get('#deliveryRoomName').type('A101');
            cy.get('#pickupContactName').type('André Silva');
            cy.get('#pickupContactPhoneNumber').type('922435231');
            cy.get('#deliveryContactName').type('André Silva');
            cy.get('#deliveryContactPhoneNumber').type('922435231');

            cy.get('#confirmationCode').type('T'.repeat(4));

            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The Pickup Building Code field is required!');
        });
    });

    it('should display a error message if creating an task with a delivery room that does not exists in the system', () => {
        cy.get('#pickupContactName').clear();
        cy.get('#pickupContactPhoneNumber').clear();
        cy.get('#deliveryContactName').clear();
        cy.get('#deliveryContactPhoneNumber').clear();

        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('E101');
            cy.get('#deliveryRoomName').type('Não existe');
            cy.get('#pickupContactName').type('André Silva');
            cy.get('#pickupContactPhoneNumber').type('922435231');
            cy.get('#deliveryContactName').type('André Silva');
            cy.get('#deliveryContactPhoneNumber').type('922435231');

            cy.get('#confirmationCode').type('T'.repeat(4));

            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The Delivery Building Code field is required!');
        });
    });

    it('should display a error message if creating an task with a invalid format pickup contact phone number', () => {
        cy.get('#pickupContactName').clear();
        cy.get('#pickupContactPhoneNumber').clear();
        cy.get('#deliveryContactName').clear();
        cy.get('#deliveryContactPhoneNumber').clear();

        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('E101');
            cy.get('#deliveryRoomName').type('A101');
            cy.get('#pickupContactName').type('André Silva');
            cy.get('#pickupContactPhoneNumber').type('92 24 35 231');
            cy.get('#deliveryContactName').type('André Silva');
            cy.get('#deliveryContactPhoneNumber').type('922435231');

            cy.get('#confirmationCode').type('T'.repeat(4));

            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The phone number is invalid. It must follow the correct pattern. (eg., 911222333 or 911 222 333)');
        });
    });

    it('should display a error message if creating an task with a invalid format delivery contact phone number', () => {
        cy.get('#pickupContactName').clear();
        cy.get('#pickupContactPhoneNumber').clear();
        cy.get('#deliveryContactName').clear();
        cy.get('#deliveryContactPhoneNumber').clear();

        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('E101');
            cy.get('#deliveryRoomName').type('A101');
            cy.get('#pickupContactName').type('André Silva');
            cy.get('#pickupContactPhoneNumber').type('922435231');
            cy.get('#deliveryContactName').type('André Silva');
            cy.get('#deliveryContactPhoneNumber').type('92 24 35 231');

            cy.get('#confirmationCode').type('T'.repeat(4));

            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The phone number is invalid. It must follow the correct pattern. (eg., 911222333 or 911 222 333)');
        });
    });

    it('should display a error message if creating an task with a description that have more than 1000 characters', () => {
        cy.get('#pickupContactName').clear();
        cy.get('#pickupContactPhoneNumber').clear();
        cy.get('#deliveryContactName').clear();
        cy.get('#deliveryContactPhoneNumber').clear();

        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('E101');
            cy.get('#deliveryRoomName').type('A101');
            cy.get('#pickupContactName').type('André Silva');
            cy.get('#pickupContactPhoneNumber').type('922435231');
            cy.get('#deliveryContactName').type('André Silva');
            cy.get('#deliveryContactPhoneNumber').type('922435231');

            cy.get('#taskDescription').type('T'.repeat(1001));
            
            cy.get('#confirmationCode').type('T'.repeat(4));

            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: Invalid length of description. It can have at most 1000 chars.');
        });
    });

    it('should display a error message if creating an task with a Confirmation Code that have more than 7 characters', () => {
        cy.get('#pickupContactName').clear();
        cy.get('#pickupContactPhoneNumber').clear();
        cy.get('#deliveryContactName').clear();
        cy.get('#deliveryContactPhoneNumber').clear();

        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('E101');
            cy.get('#deliveryRoomName').type('A101');
            cy.get('#pickupContactName').type('André Silva');
            cy.get('#pickupContactPhoneNumber').type('922435231');
            cy.get('#deliveryContactName').type('André Silva');
            cy.get('#deliveryContactPhoneNumber').type('922435231');
            cy.get('#confirmationCode').type('T'.repeat(7));

            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The inserted code is invalid. It must have from 4 up to 6 digits.');
        });
    });

    it('should display a error message if creating an task with a Confirmation Code that have less than 4 characters', () => {
        cy.get('#pickupContactName').clear();
        cy.get('#pickupContactPhoneNumber').clear();
        cy.get('#deliveryContactName').clear();
        cy.get('#deliveryContactPhoneNumber').clear();

        cy.wait('@room-list').then(() => {
            cy.get('#pickupRoomName').type('E101');
            cy.get('#deliveryRoomName').type('A101');
            cy.get('#pickupContactName').type('André Silva');
            cy.get('#pickupContactPhoneNumber').type('922435231');
            cy.get('#deliveryContactName').type('André Silva');
            cy.get('#deliveryContactPhoneNumber').type('922435231');
            cy.get('#confirmationCode').type('T'.repeat(3));

            cy.get('form').submit();

            cy.get('.form-alert-error').should('have.text', 'Error: The inserted code is invalid. It must have from 4 up to 6 digits.');
        });
    });

    it('should display a success message if creating an pickup and delivery task with valid information', () => {

        cy.wait('@room-list').then(() => {
            cy.intercept(
                {
                    method: 'POST',
                    url: '/api/tasks/deliveries'
                },
                {
                    statusCode: 201,
                    body: {}
                }
            ).as('pickup-and-delivery-task-create');

            cy.get('#pickupRoomName').type('E101');
            cy.get('#deliveryRoomName').type('A101');

            cy.get('#confirmationCode').type('123456');

            cy.get('form').submit();

            cy.wait('@pickup-and-delivery-task-create').then(() => {
                cy.get('.form-alert-success').should('have.text', 'Success: The pickup and delivery task was successfully created!');
            });

        });
    });

});
