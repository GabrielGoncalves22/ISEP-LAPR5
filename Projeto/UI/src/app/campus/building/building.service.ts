import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { Building } from 'src/app/campus/models/building.model';
import { BuildingInfo } from 'src/app/campus/models/buildingInfo.model'
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BuildingService {

    private buildingBaseURL = environment.apiBaseUrl + '/buildings';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient) {
    }

    createBuilding(building: Building): Observable<Building | String> {
        return this.http.post<Building>(
            this.buildingBaseURL,
            building,
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

    updateBuilding(building: Building, buildingCode: string, isPut: boolean = false): Observable<Building | String> {
        const url = this.buildingBaseURL + '/' + buildingCode;

        return (isPut ? this.http.put<Building>(url, building, this.httpOptions) :
            this.http.patch<Building>(url, building, this.httpOptions))
            .pipe(
                catchError(err => {
                    if (err.error.message) {
                        return throwError(() => new Error(err.error.message));
                    } else {
                        return throwError(() => new Error(err.error));
                    }
                })
            );
    }

    getAllBuildings(): Observable<Building[]> {
        return this.http.get<Building[]>(
            this.buildingBaseURL,
            this.httpOptions
        ).pipe(
            catchError(err => {
                return throwError(() => new Error('Unable to fetch buildings'));
            })
        );
    }

    getAllBuildingsInfo(): Observable<BuildingInfo[]> {
        return this.http.get<BuildingInfo[]>(this.buildingBaseURL, this.httpOptions).pipe(
            catchError((err) => {
                return throwError(() => new Error('Unable to fetch buildings'));
            })
        );
    }

    getBuildingsWithNumberFloorsBetweenMinAndMax(min: Number, max: Number): Observable<BuildingInfo[]> {
        const params = new HttpParams().set('min', min.toString()).set('max', max.toString());
        return this.http.get<BuildingInfo[]>(this.buildingBaseURL, {
            params: params,
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

}
