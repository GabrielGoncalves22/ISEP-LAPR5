import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MapService {

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient) { }

    loadMap(buildingCode: string, floorNumber: number, file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('filekey', file, file.name);

        return this.http.patch<any>(
            environment.apiBaseUrl + '/buildings/' + buildingCode + '/floors/' + floorNumber + '/map',
            formData
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

    getMap(buildingCode: string, floorNumber: number): Observable<any> {
        return this.http.get<any>(
            environment.apiBaseUrl + '/buildings/' + buildingCode + '/floors/' + floorNumber + '/map',
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
