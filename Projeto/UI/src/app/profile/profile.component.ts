import { Component, OnInit } from '@angular/core';
import { ProfileService } from './services/profile.service';
import { User } from './models/user.model';
import { catchError, of, tap } from 'rxjs';
import { TaskService } from '../task/task.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers: [ProfileService, TaskService]
})
export class ProfileComponent implements OnInit {

    user: User = {
        name: "",
        email: "",
        telephone: "",
        taxPayerNumber: "",
        role: ""
    };

    error: string | null = null;
    success: String | null = null;

    constructor(private service: ProfileService, private taskService: TaskService, private router: Router) { }

    ngOnInit(): void {
        this.loadUserData();
    }

    loadUserData() {
        this.service.getUserData().subscribe({
            next: (user: User) => {
                if (user) {
                    this.user = {
                        name: user.name,
                        email: user.email,
                        telephone: user.telephone,
                        taxPayerNumber: user.taxPayerNumber,
                        role: user.role
                    };
                } else {
                    this.error = 'Something went wrong. Please, try again later. If the error persists, contact the IT team.';
                }
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    editPersonalData() {
        const userUpdate = {
            name: this.user.name,
            telephone: this.user.telephone,
            taxPayerNumber: this.user.taxPayerNumber,
        };

        this.service.updateUser(userUpdate).pipe(
            tap({
                error: (error) => {
                    this.error = error.message;
                    this.success = null;
                }
            }),
            catchError(
                err => of(null)
            )
        ).subscribe(
            (response) => {
                if (response) {
                    this.error = null;
                    this.success = 'The user was successfully edited';
                }
            }
        );
    }

    downloadUserData() {
        this.service.downloadUserData();
    }

    deleteUser() {
        const isMainConfirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');

        if (isMainConfirmed) {
            const isSecondaryConfirmed = confirm('This will permanently delete your account, and your data will be unrecoverable. Are you absolutely sure?');

            if (isSecondaryConfirmed) {
                this.service.deleteUser();
                this.taskService.anonymizeUserSurveillanceTasks(this.user.email);
                this.taskService.anonymizeUserPickupAndDeliveryTasks(this.user.email);
                this.router.navigate(['/login']);
            }
        }
    }

}
