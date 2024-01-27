import { Component } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { UserService } from '../user.service';
import { User } from '../models/user.model';
import { Role } from '../models/role';

@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    styleUrls: ['./user-create.component.css'],
    providers: [UserService]
})

export class UserCreateComponent {

    user: User = {
        name: '',
        email: '',
        password: '',
        telephone: '',
        role: ''
    };

    repeatPassword: String = '';

    roleOptions: string[] = [Role.SystemManager, Role.CampusManager, Role.FleetManager, Role.TaskManager];

    error: Error | String | null = null;

    success: String | null = null;

    constructor(private userService: UserService) { }

    createUser() {
        if (this.passwordsMatch()) {
            this.userService.createUser(this.user).pipe(
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
                        this.success = 'The user was successfully created!';
                    }
                }
            );
        }
    }

    passwordsMatch(): boolean {
        if (this.user.password === this.repeatPassword) {
            this.error = null;
            return true;
        } else {
            this.error = 'Passwords do not match!';
            return false;
        }
    }
}
