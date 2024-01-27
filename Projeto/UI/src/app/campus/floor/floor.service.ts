import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Floor } from '../models/floor.model';

@Injectable({
    providedIn: 'root'
})

export class FloorService {
    private floorBaseURL = environment.apiBaseUrl + '/buildings/';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient) {
    }

    createFloor(floor: Floor): Observable<Floor | String> {
        return this.http.post<Floor>(
            this.floorBaseURL + 'floors',
            floor,
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

    updateFloor(floor: Floor, buildingCode: string, floorNumber: string): Observable<Floor | String> {
        return this.http.put<Floor>(
            this.floorBaseURL + buildingCode + '/floors/' + floorNumber,
            floor,
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

    getFloorsByBuilding(buildingCode: string): Observable<Floor[]> {
        return this.http.get<Floor[]>(
            this.floorBaseURL + buildingCode + '/floors',
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

    getFloorsWithPassagewaysToBuildingByBuilding(buildingCode: string): Observable<Floor[][]> {
        return this.http.get<Floor[][]>(
            this.floorBaseURL + buildingCode + '/floors/passageways',
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
