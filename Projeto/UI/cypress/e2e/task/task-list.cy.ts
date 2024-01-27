import '../../support/commands';

describe('List Task Request tests', () => {

    beforeEach(() => {
        cy.loginTaskManager();

        cy.intercept(
            {
                method: 'GET',
                url: '/api/users/role/User'
            },
            {
                statusCode: 200,
                body: 'user-list.json'
            }
        ).as('user-list');

        cy.visit('/task/list');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'List Task Request');
    });

    it('should display the form with options', () => {
        cy.get('#taskType').should('exist');
        cy.get('#status').should('exist');
        cy.get('#startDate').should('exist');
        cy.get('#endDate').should('exist');
        cy.get('#user').should('exist');
    });

    //---------------------------------------------------------------------------

    it('should display message when no surveillance tasks are available and requested status', () => {
        const startDateValue = '2000-01-01';
        const endDateValue = '2050-01-01';

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances?status=Requested&startDate=2000-01-01&endDate=2050-01-01&userEmail=user@isep.ipp.pt'
            },
            {
                statusCode: 200,
                body: []
            }
        ).as('surveillance-empty-list');

        cy.wait('@user-list').then(() => {
            cy.get('#taskType').select('Surveillance');
            cy.get('#status').select('Requested');
            cy.get('#startDate').type(startDateValue);
            cy.get('#endDate').type(endDateValue);
            cy.get('#user').type('user@isep.ipp.pt');
            cy.get('#filterButton').click();

            cy.wait('@surveillance-empty-list').then(() => {
                cy.get('.user-table.surveillance-table tbody').should('not.exist');
                cy.get('.no-surveillance-tasks').should('have.text', 'No surveillance tasks available for the indicated filters!');
            });
        });
    });

    it('should display message when no surveillance tasks are available and approved status', () => {
        const startDateValue = '2000-01-01';
        const endDateValue = '2050-01-01';

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances?status=Approved&startDate=2000-01-01&endDate=2050-01-01&userEmail=user@isep.ipp.pt'
            },
            {
                statusCode: 200,
                body: []
            }
        ).as('surveillance-empty-list');

        cy.wait('@user-list').then(() => {
            cy.get('#taskType').select('Surveillance');
            cy.get('#status').select('Approved');
            cy.get('#startDate').type(startDateValue);
            cy.get('#endDate').type(endDateValue);
            cy.get('#user').type('user@isep.ipp.pt');
            cy.get('#filterButton').click();

            cy.wait('@surveillance-empty-list').then(() => {
                cy.get('.user-table.surveillance-table tbody').should('not.exist');
                cy.get('.no-surveillance-tasks').should('have.text', 'No surveillance tasks available for the indicated filters!');
            });
        });
    });

    it('should display message when no surveillance tasks are available and rejected status', () => {
        const startDateValue = '2000-01-01';
        const endDateValue = '2050-01-01';

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances?status=Rejected&startDate=2000-01-01&endDate=2050-01-01&userEmail=user@isep.ipp.pt'
            },
            {
                statusCode: 200,
                body: []
            }
        ).as('surveillance-empty-list');

        cy.wait('@user-list').then(() => {
            cy.get('#taskType').select('Surveillance');
            cy.get('#status').select('Rejected');
            cy.get('#startDate').type(startDateValue);
            cy.get('#endDate').type(endDateValue);
            cy.get('#user').type('user@isep.ipp.pt');
            cy.get('#filterButton').click();

            cy.wait('@surveillance-empty-list').then(() => {
                cy.get('.user-table.surveillance-table tbody').should('not.exist');
                cy.get('.no-surveillance-tasks').should('have.text', 'No surveillance tasks available for the indicated filters!');
            });
        });
    });

    it('should display message when no delivery tasks are available and requested status', () => {
        const startDateValue = '2000-01-01';
        const endDateValue = '2050-01-01';

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/deliveries?status=Requested&startDate=2000-01-01&endDate=2050-01-01&userEmail=user@isep.ipp.pt'
            },
            {
                statusCode: 200,
                body: []
            }
        ).as('delivery-empty-list');

        cy.wait('@user-list').then(() => {
            cy.get('#taskType').select('Pickup and Delivery');
            cy.get('#status').select('Requested');
            cy.get('#startDate').type(startDateValue);
            cy.get('#endDate').type(endDateValue);
            cy.get('#user').type('user@isep.ipp.pt');
            cy.get('#filterButton').click();

            cy.wait('@delivery-empty-list').then(() => {
                cy.get('.user-table.delivery-table tbody').should('not.exist');
                cy.get('.no-delivery-tasks').should('have.text', 'No pickup and delivery tasks available for the indicated filters!');
            });
        });
    });

    it('should display message when no delivery tasks are available and approved status', () => {
        const startDateValue = '2000-01-01';
        const endDateValue = '2050-01-01';

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/deliveries?status=Approved&startDate=2000-01-01&endDate=2050-01-01&userEmail=user@isep.ipp.pt'
            },
            {
                statusCode: 200,
                body: []
            }
        ).as('delivery-empty-list');

        cy.wait('@user-list').then(() => {
            cy.get('#taskType').select('Pickup and Delivery');
            cy.get('#status').select('Approved');
            cy.get('#startDate').type(startDateValue);
            cy.get('#endDate').type(endDateValue);
            cy.get('#user').type('user@isep.ipp.pt');
            cy.get('#filterButton').click();

            cy.wait('@delivery-empty-list').then(() => {
                cy.get('.user-table.delivery-table tbody').should('not.exist');
                cy.get('.no-delivery-tasks').should('have.text', 'No pickup and delivery tasks available for the indicated filters!');
            });
        });
    });

    it('should display message when no delivery tasks are available and rejected status', () => {
        const startDateValue = '2000-01-01';
        const endDateValue = '2050-01-01';

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/deliveries?status=Rejected&startDate=2000-01-01&endDate=2050-01-01&userEmail=user@isep.ipp.pt'
            },
            {
                statusCode: 200,
                body: []
            }
        ).as('delivery-empty-list');

        cy.wait('@user-list').then(() => {
            cy.get('#taskType').select('Pickup and Delivery');
            cy.get('#status').select('Rejected');
            cy.get('#startDate').type(startDateValue);
            cy.get('#endDate').type(endDateValue);
            cy.get('#user').type('user@isep.ipp.pt');
            cy.get('#filterButton').click();

            cy.wait('@delivery-empty-list').then(() => {
                cy.get('.user-table.delivery-table tbody').should('not.exist');
                cy.get('.no-delivery-tasks').should('have.text', 'No pickup and delivery tasks available for the indicated filters!');
            });
        });
    });

    //---------------------------------------------------------------------------

    it('should sort the table by Id in ascending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Id")').click();
            cy.get('th:contains("Id")').should('have.class', 'ascending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(0)').should('have.text', '6588361383199125ba134a6d');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(0)').should('have.text', '65886597325a7d7958b74b78');
        });
    });

    it('should sort the table by Id in descending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Id")').click();
            cy.get('th:contains("Id")').click();
            cy.get('th:contains("Id")').should('have.class', 'descending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(0)').should('have.text', '65886597325a7d7958b74b78');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(0)').should('have.text', '6588361383199125ba134a6d');
        });
    });

    it('should sort the table by Building Code in ascending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Building Code")').click();
            cy.get('th:contains("Building Code")').should('have.class', 'ascending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(1)').should('have.text', 'A');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(1)').should('have.text', 'E');
        });
    });

    it('should sort the table by Building Code in descending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Building Code")').click();
            cy.get('th:contains("Building Code")').click();
            cy.get('th:contains("Building Code")').should('have.class', 'descending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(1)').should('have.text', 'E');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(1)').should('have.text', 'A');
        });
    });

    it('should sort the table by Emergency Contact Name in ascending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Emergency Contact Name")').click();
            cy.get('th:contains("Emergency Contact Name")').should('have.class', 'ascending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(2)').should('have.text', 'André Silva Pereira');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(2)').should('have.text', 'Manuel Monteiro');
        });
    });

    it('should sort the table by Emergency Contact Name in descending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Emergency Contact Name")').click();
            cy.get('th:contains("Emergency Contact Name")').click();
            cy.get('th:contains("Emergency Contact Name")').should('have.class', 'descending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(2)').should('have.text', 'Manuel Monteiro');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(2)').should('have.text', 'André Silva Pereira');
        });
    });

    it('should sort the table by Emergency Contact Phone Number in ascending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Emergency Contact Phone Number")').click();
            cy.get('th:contains("Emergency Contact Phone Number")').should('have.class', 'ascending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(3)').should('have.text', '913453976');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(3)').should('have.text', '922435233');
        });
    });

    it('should sort the table by Emergency Contact Phone Number in descending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Emergency Contact Phone Number")').click();
            cy.get('th:contains("Emergency Contact Phone Number")').click();
            cy.get('th:contains("Emergency Contact Phone Number")').should('have.class', 'descending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(3)').should('have.text', '922435233');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(3)').should('have.text', '913453976');
        });
    });

    it('should sort the table by Surveillance Task Floors in ascending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Surveillance Task Floors")').click();
            cy.get('th:contains("Surveillance Task Floors")').should('have.class', 'ascending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(4)').should('have.text', '0');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(4)').should('have.text', '10');
        });
    });

    it('should sort the table by Surveillance Task Floors in descending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Surveillance Task Floors")').click();
            cy.get('th:contains("Surveillance Task Floors")').click();
            cy.get('th:contains("Surveillance Task Floors")').should('have.class', 'descending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(4)').should('have.text', '10');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(4)').should('have.text', '0');
        });
    });

    it('should sort the table by Created By in ascending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Created By")').click();
            cy.get('th:contains("Created By")').should('have.class', 'ascending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(6)').should('have.text', 'user1@isep.ipp.pt');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(6)').should('have.text', 'user2@isep.ipp.pt');
        });
    });

    it('should sort the table by Created By in descending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Created By")').click();
            cy.get('th:contains("Created By")').click();
            cy.get('th:contains("Created By")').should('have.class', 'descending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(6)').should('have.text', 'user2@isep.ipp.pt');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(6)').should('have.text', 'user1@isep.ipp.pt');
        });
    });

    it('should sort the table by Created In in ascending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Created In")').click();
            cy.get('th:contains("Created In")').should('have.class', 'ascending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(7)').should('have.text', '23/12/2023 20:41:30');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(7)').should('have.text', '25/12/2023 09:35:30');
        });
    });

    it('should sort the table by Created In in descending order', () => {

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Created In")').click();
            cy.get('th:contains("Created In")').click();
            cy.get('th:contains("Created In")').should('have.class', 'descending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(7)').should('have.text', '25/12/2023 09:35:30');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(7)').should('have.text', '23/12/2023 20:41:30');
        });
    });

    //---------------------------------------------------------------------------

    it('should list the surveillance tasks successfully', () => {
        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');
        cy.get('#filterButton').click();

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('.user-table.common-table tbody tr').should('have.length', 2);

            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(0)').should('have.text', '65886597325a7d7958b74b78');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(1)').should('have.text', 'E');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(2)').should('have.text', 'Manuel Monteiro');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(3)').should('have.text', '913453976');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(4)').should('have.text', '0');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(5)').should('have.text', 'Requested');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(6)').should('have.text', 'user2@isep.ipp.pt');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(7)').should('have.text', '25/12/2023 09:35:30');

            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(0)').should('have.text', '6588361383199125ba134a6d');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(1)').should('have.text', 'A');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(2)').should('have.text', 'André Silva Pereira');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(3)').should('have.text', '922435233');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(4)').should('have.text', '10');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(5)').should('have.text', 'Requested');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(6)').should('have.text', 'user1@isep.ipp.pt');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(7)').should('have.text', '23/12/2023 20:41:30');
        });
    });

    it('should list the surveillance tasks successfully when there is filters', () => {
        const startDateValue = '2000-01-01';
        const endDateValue = '2050-01-01';

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances?status=Requested&startDate=2000-01-01&endDate=2050-01-01&userEmail=user@isep.ipp.pt'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-with-filters-list.json'
            }
        ).as('surveillance-requested-with-filters-list');

        cy.wait('@user-list').then(() => {
            cy.get('#taskType').select('Surveillance');
            cy.get('#status').select('Requested');
            cy.get('#startDate').type(startDateValue);
            cy.get('#endDate').type(endDateValue);
            cy.get('#user').type('user@isep.ipp.pt');
            cy.get('#filterButton').click();

            cy.wait('@surveillance-requested-with-filters-list').then(() => {
                cy.get('.user-table.common-table tbody tr').should('have.length', 1);

                cy.get('.user-table.common-table tbody tr:eq(0) td:eq(0)').should('have.text', '6588361383199125ba134a6d');
                cy.get('.user-table.common-table tbody tr:eq(0) td:eq(1)').should('have.text', 'A');
                cy.get('.user-table.common-table tbody tr:eq(0) td:eq(2)').should('have.text', 'André Silva Pereira');
                cy.get('.user-table.common-table tbody tr:eq(0) td:eq(3)').should('have.text', '922435233');
                cy.get('.user-table.common-table tbody tr:eq(0) td:eq(4)').should('have.text', '10');
                cy.get('.user-table.common-table tbody tr:eq(0) td:eq(5)').should('have.text', 'Requested');
                cy.get('.user-table.common-table tbody tr:eq(0) td:eq(6)').should('have.text', 'user@isep.ipp.pt');
                cy.get('.user-table.common-table tbody tr:eq(0) td:eq(7)').should('have.text', '23/12/2023 20:41:30');
            });
        });
    });
});