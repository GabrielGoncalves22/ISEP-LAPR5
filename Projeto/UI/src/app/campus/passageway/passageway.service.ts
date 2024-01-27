import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Passageway } from "../models/passageway.model";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class PassagewayService {

    private passagewayBaseURL = environment.apiBaseUrl + '/buildings/passageways';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient) {
    }

    createPassageway(passageway: Passageway): Observable<Passageway | string> {
        return this.http.post<Passageway>(
            this.passagewayBaseURL,
            passageway,
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

    updatePassageway(passageway: Passageway, passagewayCode: String): Observable<Passageway | String> {
        return this.http.put<Passageway>(
            this.passagewayBaseURL + '/' + passagewayCode,
            passageway,
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

    listAllPassageways() {
        return this.http.get<Passageway[]>(this.passagewayBaseURL, this.httpOptions).pipe(
            catchError(err => {
                if (err.error.message) {
                    return throwError(() => new Error(err.error.message));
                } else {
                    return throwError(() => new Error(err.error));
                }
            })
        );
    }

    listPassagewaysBetweenTwoBuildings(codeBuilding1: string, codeBuilding2: string): Observable<Passageway[]> {
        let options;
        if (codeBuilding1 !== '') {
            const params = new HttpParams().set('building1', codeBuilding1).set('building2', codeBuilding2);
            options = {
                params: params,
                headers: this.httpOptions.headers
            }
        } else {
            options = {
                headers: this.httpOptions.headers
            }
        }

        return this.http.get<Passageway[]>(this.passagewayBaseURL, options).pipe(
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
