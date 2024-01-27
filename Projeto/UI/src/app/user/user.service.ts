import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './models/user.model';

@Injectable({
    providedIn: 'root'
})

export class UserService {

    private userBaseURL = environment.apiBaseUrl + '/users';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient) { }

    createUser(user: User): Observable<User | String> {
        return this.http.post<User>(
            this.userBaseURL + '/register',
            user,
            this.httpOptions
        ).pipe(
            catchError(err => {
                if (err.error.message) {
                    return throwError(() => new Error(err.error.message));
                } else {
                    return throwError(() => new Error(err.error));
                }
            })
        );
    }

    getUsersByRole(role?: string): Observable<User[]> {
        let url = `${this.userBaseURL}/role`;
        if (role)
            url += `/${role}`;

        return this.http.get<User[]>(url, this.httpOptions).pipe(
            catchError(err => {
                if (err.error.message) {
                    return throwError(() => new Error(err.error.message));
                } else {
                    return throwError(() => new Error(err.error));
                }
            })
        );
    }

    toggle(userId: String): Observable<User> {
        const requestData = { id: userId };
        return this.http.patch<User>(
            `${this.userBaseURL}/activate`,
            requestData,
            this.httpOptions
        ).pipe(
            catchError(err => {
                if (err.error.message) {
                    return throwError(() => new Error(err.error.message));
                } else {
                    return throwError(() => new Error(err.error));
                }
            })
        )
    }

    getUserData(): Observable<User> {
        return this.http.get<User>(
            this.userBaseURL + "/me",
            this.httpOptions
        ).pipe(
            catchError(err => {
                if (err.error.message) {
                    return throwError(() => new Error(err.error.message));
                } else {
                    return throwError(() => new Error(err.error));
                }
            })
        );
    }
}
