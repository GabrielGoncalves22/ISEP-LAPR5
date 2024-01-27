import '../../support/commands';

describe('Approve/Reject Task Request tests', () => {

    beforeEach(() => {
        cy.loginTaskManager();
        cy.visit('/task/approve');
    });

    it('should display the page title', () => {
        cy.get('h1.center').should('have.text', 'Approve/Reject Task Request');
    });

    it('should display the form with options', () => {
        cy.get('#taskType').should('exist');
        cy.get('label[for="taskType"]').invoke('text').should('eq', 'Select Task Type: ');

        cy.get('#taskType option').should('have.length', 2);
        cy.get('#taskType option').should('contain.text', 'Surveillance');
        cy.get('#taskType option').should('contain.text', 'Pickup and Delivery');
    });

    it('should display message when no surveillance tasks are available', () => {
        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                body: []
            }
        ).as('surveillance-empty-list');

        cy.get('#taskType').select('Surveillance');

        cy.wait('@surveillance-empty-list').then(() => {
            cy.get('.user-table.common-table tbody').should('not.exist');
            cy.get('.no-surveillance-tasks').should('have.text', 'No surveillance tasks available!');
        });
    });

    it('should display message when no delivery tasks are available', () => {
        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/deliveries?status=Requested'
            },
            {
                statusCode: 200,
                body: []
            }
        ).as('delivery-empty-list');

        cy.get('#taskType').select('Pickup and Delivery');

        cy.wait('@delivery-empty-list').then(() => {
            cy.get('.user-table.delivery-table tbody').should('not.exist');
            cy.get('.no-delivery-tasks').should('have.text', 'No pickup and delivery tasks available!');
        });
    });

    it('should check if all surveillance type task requests are listed correctly', () => {
        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('.user-table.common-table tbody tr').should('have.length', 2);

            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(0)').should('have.text', '65886597325a7d7958b74b78');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(1)').should('have.text', 'E');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(2)').should('have.text', 'Manuel Monteiro');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(3)').should('have.text', '913453976');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(4)').should('have.text', '0');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(5)').should('have.text', 'user2@isep.ipp.pt');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(6)').should('have.text', '25/12/2023 09:35:30');

            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(0)').should('have.text', '6588361383199125ba134a6d');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(1)').should('have.text', 'A');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(2)').should('have.text', 'André Silva Pereira');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(3)').should('have.text', '922435233');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(4)').should('have.text', '10');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(5)').should('have.text', 'user1@isep.ipp.pt');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(6)').should('have.text', '23/12/2023 20:41:30');
        });
    });

    it('should sort the table by Id in ascending order', () => {
        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

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
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

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
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

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
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

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
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

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
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

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
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

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
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

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
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

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
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

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
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Created By")').click();
            cy.get('th:contains("Created By")').should('have.class', 'ascending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(5)').should('have.text', 'user1@isep.ipp.pt');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(5)').should('have.text', 'user2@isep.ipp.pt');
        });
    });

    it('should sort the table by Created By in descending order', () => {
        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Created By")').click();
            cy.get('th:contains("Created By")').click();
            cy.get('th:contains("Created By")').should('have.class', 'descending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(5)').should('have.text', 'user2@isep.ipp.pt');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(5)').should('have.text', 'user1@isep.ipp.pt');
        });
    });

    it('should sort the table by Created In in ascending order', () => {
        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Created In")').click();
            cy.get('th:contains("Created In")').should('have.class', 'ascending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(6)').should('have.text', '23/12/2023 20:41:30');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(6)').should('have.text', '25/12/2023 09:35:30');
        });
    });

    it('should sort the table by Created In in descending order', () => {
        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.get('#taskType').select('Surveillance');

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('th:contains("Created In")').click();
            cy.get('th:contains("Created In")').click();
            cy.get('th:contains("Created In")').should('have.class', 'descending');
            cy.get('.user-table.common-table tbody tr:eq(0) td:eq(6)').should('have.text', '25/12/2023 09:35:30');
            cy.get('.user-table.common-table tbody tr:eq(1) td:eq(6)').should('have.text', '23/12/2023 20:41:30');
        });
    });

    it('should approve a surveillance task and show success alert', () => {
        const taskId = "65886597325a7d7958b74b78";

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.intercept(
            {
                method: 'PATCH',
                url: `/api/tasks/surveillances/${taskId}/approve`
            },
            {
                statusCode: 200,
                body: {}
            }
        ).as('approve-task');

        cy.get('#taskType').select('Surveillance');

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('.user-table.common-table tbody tr:eq(0) .approve-button').click();

            cy.wait('@approve-task').then(() => {
                cy.get('.swal2-success').should('have.class', 'swal2-success');
                cy.get('.swal2-title').should('have.text', 'Task approved successfully!');
            });
        });
    });

    it('should reject a surveillance task and show success alert', () => {
        const taskId = "65886597325a7d7958b74b78";

        cy.intercept(
            {
                method: 'GET',
                url: '/api/tasks/surveillances?status=Requested'
            },
            {
                statusCode: 200,
                fixture: 'surveillance-requested-list.json'
            }
        ).as('surveillance-requested-list');

        cy.intercept(
            {
                method: 'PATCH',
                url: `/api/tasks/surveillances/${taskId}/reject`
            },
            {
                statusCode: 200,
                body: {}
            }
        ).as('reject-task');

        cy.get('#taskType').select('Surveillance');

        cy.wait('@surveillance-requested-list').then(() => {
            cy.get('.user-table.common-table tbody tr:eq(0) .deny-button').click();

            cy.wait('@reject-task').then(() => {
                cy.get('.swal2-success').should('have.class', 'swal2-success');
                cy.get('.swal2-title').should('have.text', 'Task rejected successfully!');
            });
        });
    });
});
