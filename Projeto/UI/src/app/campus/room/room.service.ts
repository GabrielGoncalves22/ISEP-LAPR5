import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Room } from '../models/room.model';
import { RoomLocalization } from '../models/roomLocalization.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
    private roomBaseURL = environment.apiBaseUrl + '/buildings/rooms';
    
    private httpOptions = {
        headers: new HttpHeaders ({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient) { }

    createRoom(room: Room): Observable<Room | String> {
        return this.http.post<Room>(
            this.roomBaseURL,
            room,
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

    getAllRooms(): Observable<Room[]> {
        return this.http.get<Room[]>(
            this.roomBaseURL,
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

    getRoomDataByRoomNameAndBuildingCode(buildingCode: string, roomName: string): Observable<RoomLocalization> {
        return this.http.get<RoomLocalization>(
            environment.apiBaseUrl + "/buildings/" + buildingCode + "/rooms/" + roomName,
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
