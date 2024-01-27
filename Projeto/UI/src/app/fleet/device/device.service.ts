import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Device} from '../models/device.model';

@Injectable({
    providedIn: 'root'
})

export class DeviceService {

    private deviceBaseURL = environment.apiBaseUrl + '/devices';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient) {
    }

    createDevice(device: Device): Observable<Device | String> {
        return this.http.post<Device>(
            this.deviceBaseURL,
            device,
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

    updateStateDevice(code: string): Observable<Device> {
        const url = this.deviceBaseURL + `/${code}`;

        return this.http.patch<Device>(url, this.httpOptions).pipe(
            catchError(err => {
                if (err.error.message) {
                    return throwError(() => new Error(err.error.message));
                } else {
                    return throwError(() => new Error(err.error));
                }
            })
        );
    }

    getAllDevices(): Observable<Device[]> {
        return this.http.get<Device[]>(this.deviceBaseURL, this.httpOptions).pipe(
            catchError((err) => {
                return throwError(() => new Error('Unable to fetch devices'));
            })
        );
    }
}
