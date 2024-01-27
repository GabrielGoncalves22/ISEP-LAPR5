import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './models/user.model';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private userBaseURL = environment.apiBaseUrl + '/users';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    private userSubject: BehaviorSubject<User | null>;

    public user: Observable<User | null>;

    constructor(private http: HttpClient) {
        this.userSubject = new BehaviorSubject<User | null>(
            JSON.parse(localStorage.getItem('user')!)
        );

        this.user = this.userSubject.asObservable();
    }

    register(user: User): Observable<User | String> {
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

    login(email: string, password: string, withFacebook: boolean = false) {
        return this.http.post<any>(
            this.userBaseURL + "/login",
            { email, password, withFacebook }
        ).pipe(
            map(user => localStorage.setItem('user', JSON.stringify(user))),
            catchError(err => {
                if (err.error.message) {
                    return throwError(() => new Error(err.error.message));
                } else {
                    return throwError(() => new Error(err.error));
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('user');
    }

    getUser(): string | null {
        return localStorage.getItem("user") ? localStorage.getItem("user") : null;
    }

    getToken(): string | null {
        return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).token : null;
    }

    getRole(): string | null {
        return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).user.role : null;
    }
}
