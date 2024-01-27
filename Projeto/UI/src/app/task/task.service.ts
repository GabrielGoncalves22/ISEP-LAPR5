import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { SurveillanceTask } from './models/surveillanceTask.model';
import { PickupAndDeliveryTask } from './models/pickupAndDeliveryTask.model';

@Injectable({
    providedIn: 'root'
})

export class TaskService {

    private surveillanceTaskBaseURL = environment.apiTaskBaseUrl + '/tasks/surveillances';
    private pickupAndDeliveryTaskBaseURL = environment.apiTaskBaseUrl + '/tasks/deliveries';

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient) { }

    createSurveillanceTask(surveillanceTask: SurveillanceTask): Observable<SurveillanceTask | String> {
        return this.http.post<SurveillanceTask>(
            this.surveillanceTaskBaseURL,
            surveillanceTask,
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

    createPickupAndDeliveryTask(pickupAndDeliveryTask: PickupAndDeliveryTask): Observable<PickupAndDeliveryTask | String> {
        return this.http.post<PickupAndDeliveryTask>(
            this.pickupAndDeliveryTaskBaseURL,
            pickupAndDeliveryTask,
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

    getSurveillanceTasks(status?: string, startDate?: string, endDate?: string, userEmail?: string): Observable<SurveillanceTask[]> {
        let params = new HttpParams();

        if (status) {
            params = params.set('status', status);
        }

        if (startDate) {
            params = params.set('startDate', startDate);
        }

        if (endDate) {
            params = params.set('endDate', endDate);
        }

        if (userEmail) {
            params = params.set('userEmail', userEmail);
        }

        return this.http.get<SurveillanceTask[]>(
            this.surveillanceTaskBaseURL,
            { params: params, headers: this.httpOptions.headers }
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

    getPickupAndDeliveryTask(status?: string, startDate?: string, endDate?: string, userEmail?: string): Observable<PickupAndDeliveryTask[]> {
        let params = new HttpParams();

        if (status) {
            params = params.set('status', status);
        }

        if (startDate) {
            params = params.set('startDate', startDate);
        }

        if (endDate) {
            params = params.set('endDate', endDate);
        }

        if (userEmail) {
            params = params.set('userEmail', userEmail);
        }

        return this.http.get<PickupAndDeliveryTask[]>(
            this.pickupAndDeliveryTaskBaseURL,
            { params: params, headers: this.httpOptions.headers }
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

    approveRejectTask(taskId: string, isApprove: boolean, isSurveillanceTask: boolean): Observable<String> {
        const url = `${isSurveillanceTask ? this.surveillanceTaskBaseURL : this.pickupAndDeliveryTaskBaseURL}/${taskId}/${isApprove ? 'approve' : 'reject'}`;

        return this.http.patch<String>(url, this.httpOptions).pipe(
            catchError(err => {
                if (err.error.message) {
                    return throwError(() => new Error(err.error.message));
                } else {
                    return throwError(() => new Error(err.error));
                }
            })
        );
    }

    anonymizeUserSurveillanceTasks(userEmail: string) {
        let params = new HttpParams();
        params = params.set('userEmail', userEmail);

        return this.http.patch(this.surveillanceTaskBaseURL, {},
            { params: params, headers: this.httpOptions.headers })
            .subscribe({
                error: error => {
                    return throwError(() => new Error(error));
                }
            });
    }

    anonymizeUserPickupAndDeliveryTasks(userEmail: string) {
        let params = new HttpParams();
        params = params.set('userEmail', userEmail);

        return this.http.patch(this.pickupAndDeliveryTaskBaseURL, {},
            { params: params, headers: this.httpOptions.headers })
            .subscribe({
                error: error => {
                    return throwError(() => new Error(error));
                }
            });
    }
}