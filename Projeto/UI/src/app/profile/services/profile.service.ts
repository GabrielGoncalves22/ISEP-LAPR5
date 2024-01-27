import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { UserDownloadData } from '../models/user.download.data.model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { UserUpdate } from '../models/user.update.model';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private userBaseURL = environment.apiBaseUrl + '/users';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    private FILE_NAME: string = "RobDroneGo_Personal_Data.json";

    constructor(private http: HttpClient) { }

    getUserData(): Observable<User> {
        return this.http.get<User>(
            this.userBaseURL + '/me',
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

    downloadUserData() {
        this.getUserData().subscribe({
            next: (user: User) => {
                if (user) {
                    const dataToDownload: UserDownloadData = {
                        name: user.name,
                        email: user.email,
                        telephone: user.telephone,
                        taxPayerNumber: user.taxPayerNumber
                    };

                    const jsonData = JSON.stringify(dataToDownload);

                    const blob = new Blob([jsonData], { type: 'application/json' });

                    // Cria um objeto URL temporário para o Blob
                    const url = window.URL.createObjectURL(blob);

                    // Cria um link <a> para o objeto URL e forçamos o click nele para iniciar o download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = this.FILE_NAME;
                    document.body.appendChild(a);
                    a.click();

                    // Remove o objeto URL e remove o link
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);

                } else {
                    alert('Something went wrong. Please, try again later. If the error persists, contact the IT team.');
                }
            },
            error: (error) => {
                alert('Something went wrong. Please, try again later. If the error persists, contact the IT team.');
            }
        });
    }

    updateUser(user: UserUpdate) {
        const url = this.userBaseURL + "/profile";

        return this.http.put<User>(url, user, this.httpOptions).pipe(
            catchError(err => {
                if (err.error.message) {
                    return throwError(() => new Error(err.error.message));
                } else {
                    return throwError(() => new Error(err.error));
                }
            })
        );
    }

    deleteUser() {
        return this.http.delete(this.userBaseURL + "/me", this.httpOptions)
            .subscribe({
                error: error => {
                    return throwError(() => new Error(error));
                }
            })
    }
}
