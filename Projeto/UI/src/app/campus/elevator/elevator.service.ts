import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, pipe, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Elevator } from '../models/elevator.model';

@Injectable({
    providedIn: 'root'
})

export class ElevatorService {

    private elevatorBaseURL = environment.apiBaseUrl + '/buildings/elevators';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient) { }

    createElevator(elevator: Elevator): Observable<Elevator | String> {
        return this.http.post<Elevator>(
            this.elevatorBaseURL,
            elevator,
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

    getElevatorByBuilding(code: string): Observable<Elevator> {
        const url = environment.apiBaseUrl + `/buildings/${code}/elevators`;
        return this.http.get<Elevator>(url, {
            headers: this.httpOptions.headers
        }).pipe(
            catchError(err => {
                if (err.error.message) {
                    return throwError(() => new Error(err.error.message));
                } else {
                    return throwError(() => new Error(err.error));
                }
            })
        );
    }

    patchElevator(elevator: Elevator, buildingCode: string): Observable<Elevator> {
        return this.http.patch<Elevator>(
            environment.apiBaseUrl + `/buildings/${buildingCode}/elevators`,
            elevator,
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
