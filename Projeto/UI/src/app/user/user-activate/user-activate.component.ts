import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models/user.model';

@Component({
	selector: 'app-user-activate',
	templateUrl: './user-activate.component.html',
	styleUrls: ['./user-activate.component.css'],
	providers: [UserService]
})

export class UserActivateComponent implements OnInit {

	users: User[] = [];
	sortedUsers: User[] = [];

	sortField: keyof User = 'name';
	sortOrder: number = 1;
	sortDirection: 'asc' | 'desc' = 'asc';

	error: String | null = null;

	pageSize = 10;
	currentPage = 1;

	constructor(private service: UserService) { }

	ngOnInit(): void {
		this.getUsers();
	}

	getUsers() {
		this.service.getUsersByRole().subscribe({
			next: (users: User[]) => {
				this.users = users;
				this.sort(this.sortField);
			},
			error: (error) => {
				this.error = error.message;
			}
		});
	}

	toggle(user: User) {
		this.service.toggle(user.email).subscribe(
			(updatedUser: User) => {
				const index = this.users.findIndex((u) => u.email === user.email);
				if (index !== -1) {
					this.users[index] = updatedUser;
					this.sortOrder = -this.sortOrder;
					this.sort(this.sortField);
				}
			},
			(error) => {
				console.error('Toggle error:', error);
				this.error = error.message;
			}
		);
	}

	sort(field: keyof User) {
		if (this.sortField === field) {
			this.sortOrder = -this.sortOrder;
		} else {
			this.sortOrder = 1;
			this.sortField = field;
		}

		this.sortDirection = this.sortOrder === 1 ? 'asc' : 'desc';

		this.sortedUsers = [...this.users].sort((a, b) => {
			if (field === 'active') {
				return this.sortActivation(a.active, b.active);
			}

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

	sortActivation(valueA: boolean | undefined, valueB: boolean | undefined): number {
		if (valueA === undefined && valueB === undefined) {
			return 0;
		}

		if (valueA === undefined) {
			return this.sortOrder;
		}

		if (valueB === undefined) {
			return -this.sortOrder;
		}

		return valueA === valueB ? 0 : (valueA ? this.sortOrder : -this.sortOrder);
	}


}
