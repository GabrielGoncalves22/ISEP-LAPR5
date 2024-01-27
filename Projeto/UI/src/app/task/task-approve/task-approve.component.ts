import { Component } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { TaskService } from '../task.service';
import { SurveillanceTask } from '../models/surveillanceTask.model';
import { PickupAndDeliveryTask } from '../models/pickupAndDeliveryTask.model';
import { Status } from '../models/status';

@Component({
	selector: 'app-task-approve',
	templateUrl: './task-approve.component.html',
	styleUrls: ['./task-approve.component.css'],
	providers: [TaskService]
})

export class TaskApproveComponent {

	surTask: SurveillanceTask[] = [];
	sortedSurTasks: SurveillanceTask[] = [];

	delTask: PickupAndDeliveryTask[] = [];
	sortedDelTask: PickupAndDeliveryTask[] = [];

	selectedTaskType: string = '';

	sortField: keyof SurveillanceTask = 'id';

	sortOrder: number = 1;
	sortDirection: 'asc' | 'desc' = 'asc';

	sortFieldDel: keyof PickupAndDeliveryTask = 'id';

	sortOrderDel: number = 1;
	sortDirectionDel: 'asc' | 'desc' = 'asc';

	error: Error | string | null = null;

	pageSize = 10;
	currentPage = 1;

	constructor(private service: TaskService) { }

	fetchTasks() {
		if (this.selectedTaskType === 'surveillance') {
			this.getSurveillanceTasks();
			this.delTask = [];
		} else if (this.selectedTaskType === 'delivery') {
			this.getPickupAndDeliveryTask();
			this.surTask = [];
		}

		this.currentPage = 1;
	}

	onTaskTypeChange() {
		this.fetchTasks();
	}

	getSurveillanceTasks() {
		this.service.getSurveillanceTasks(Status.Requested).subscribe({
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
		this.service.getPickupAndDeliveryTask(Status.Requested).subscribe({
			next: (task: PickupAndDeliveryTask[]) => {
				this.delTask = task;
				this.sortDel(this.sortFieldDel);
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

	performTaskAction(taskId: string, isApprove: boolean): void {
		const isSurveillanceTask = this.selectedTaskType === 'surveillance';

		this.service.approveRejectTask(taskId, isApprove, isSurveillanceTask).pipe(
			tap({
				error: (error) => {
					Swal.fire(error.message, '', 'error');
				}
			}),
			catchError(
				err => of(null)
			)
		).subscribe(
			() => {
				Swal.fire(`Task ${isApprove ? 'approved' : 'rejected'} successfully!`, '', 'success');
				this.fetchTasks();
			}
		);
	}
}
