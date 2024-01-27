import { Component } from '@angular/core';
import { TaskService } from '../task.service';
import { UserService } from 'src/app/user/user.service';
import { SurveillanceTask } from '../models/surveillanceTask.model';
import { PickupAndDeliveryTask } from '../models/pickupAndDeliveryTask.model';
import { User } from 'src/app/user/models/user.model';
import { Role } from 'src/app/user/models/role';
import { Status } from './../models/status';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})

export class TaskListComponent {

    surTask: SurveillanceTask[] = [];
    sortedSurTasks: SurveillanceTask[] = [];

    delTask: PickupAndDeliveryTask[] = [];
    sortedDelTask: PickupAndDeliveryTask[] = [];

    statusOptions: string[] = [Status.Requested, Status.Approved, Status.Rejected];

    users: User[] = [];

    selectedTaskType: string = '';
    selectedStatus: string = '';
    startDate: string = "";
    endDate: string = "";
    selectedUser: string = '';

    clickFilterButton: boolean = false;

    sortField: keyof SurveillanceTask = 'id';

    sortOrder: number = 1;
    sortDirection: 'asc' | 'desc' = 'asc';

    sortFieldDel: keyof PickupAndDeliveryTask = 'id';

    sortOrderDel: number = 1;
    sortDirectionDel: 'asc' | 'desc' = 'asc';

    error: Error | string | null = null;

    pageSize = 10;
    currentPage = 1;

    constructor(private taskService: TaskService, private userService: UserService) {
        this.getAllUsers();
    }

    onTaskTypeChange() {
        this.clickFilterButton = false;
    }

    onFilterButtonClick() {
        if (this.selectedTaskType === 'surveillance') {
            this.getSurveillanceTasks();
            this.delTask = [];
            this.error = null;
        } else if (this.selectedTaskType === 'delivery') {
            this.getPickupAndDeliveryTask();
            this.surTask = [];
            this.error = null;
        } else {
            this.error = 'Please select a task type';
        }

        this.clickFilterButton = true;
        this.currentPage = 1;
    }

    getSurveillanceTasks() {
        this.taskService.getSurveillanceTasks(this.selectedStatus, this.startDate, this.endDate, this.selectedUser).subscribe({
            next: (task: SurveillanceTask[]) => {
                this.surTask = task;
                this.sortSur(this.sortField);
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    getPickupAndDeliveryTask() {
        this.taskService.getPickupAndDeliveryTask(this.selectedStatus, this.startDate, this.endDate, this.selectedUser).subscribe({
            next: (task: PickupAndDeliveryTask[]) => {
                this.delTask = task;
                this.sortDel(this.sortFieldDel);
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    getAllUsers() {
        this.userService.getUsersByRole(Role.User).subscribe({
            next: (users: User[]) => {
                this.users = users;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    sortSur(field: keyof SurveillanceTask) {
        if (this.sortField === field) {
            this.sortOrder = -this.sortOrder;
        } else {
            this.sortOrder = 1;
            this.sortField = field;
        }

        this.sortDirection = this.sortOrder === 1 ? 'asc' : 'desc';

        this.sortedSurTasks = [...this.surTask].sort((a, b) => {

            const valueA = a[field];
            const valueB = b[field];

            if (valueA === undefined) {
                return this.sortOrder;
            }
            if (valueB === undefined) {
                return -this.sortOrder;
            }

            if (valueA < valueB) {
                return -1 * this.sortOrder;
            } else if (valueA > valueB) {
                return 1 * this.sortOrder;
            } else {
                return 0;
            }
        });
    }

    sortDel(field: keyof PickupAndDeliveryTask) {
        if (this.sortFieldDel === field) {
            this.sortOrderDel = -this.sortOrderDel;
        } else {
            this.sortOrderDel = 1;
            this.sortFieldDel = field;
        }

        this.sortDirectionDel = this.sortOrderDel === 1 ? 'asc' : 'desc';

        this.sortedDelTask = [...this.delTask].sort((a, b) => {

            const valueA = a[field];
            const valueB = b[field];

            if (valueA === undefined) {
                return this.sortOrderDel;
            }
            if (valueB === undefined) {
                return -this.sortOrderDel;
            }

            if (valueA < valueB) {
                return -1 * this.sortOrderDel;
            } else if (valueA > valueB) {
                return 1 * this.sortOrderDel;
            } else {
                return 0;
            }
        });
    }
}
