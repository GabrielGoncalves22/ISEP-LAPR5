import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DeviceType } from '../models/deviceType.model';

@Injectable({
    providedIn: 'root'
})

export class DeviceTypeService {

    private deviceTypeBaseURL = environment.apiBaseUrl + '/devices/types';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient) { }

    createDeviceType(deviceType: DeviceType): Observable<DeviceType | String> {
        return this.http.post<DeviceType>(
            this.deviceTypeBaseURL,
            deviceType,
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

    //not implemented
    getAllDeviceTypes(): Observable<DeviceType[]> {
        return this.http.get<DeviceType[]>(this.deviceTypeBaseURL, this.httpOptions).pipe(
            catchError(() => {
                return throwError(() => new Error('Unable to fetch device types'));
            })
        );
    }

}
