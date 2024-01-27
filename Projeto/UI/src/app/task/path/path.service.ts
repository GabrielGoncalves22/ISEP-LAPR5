import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Path } from '../models/path.model';
import { CellPath } from 'src/app/visualization/models/cellPath.model';
import { UseElevator } from 'src/app/visualization/models/useElevator.model';
import { UsePassageway } from 'src/app/visualization/models/usePassageway.model';
import { PickupAndDeliveryTask } from '../models/pickupAndDeliveryTask.model';

@Injectable({
    providedIn: 'root'
})
export class PathService {
    private baseUrl = 'http://localhost:5000/api/planning';
    private baseUrlMDT = 'http://localhost:5281/api/tasks/deliveries/exec';

    constructor(private http: HttpClient) { }

    getPath(origin: string, destination: string, sNode: string, eNode: string): Observable<Path[]> {
        const params = new HttpParams().set('origin', origin).set('destination', destination)
            .set('sNode', sNode).set('eNode', eNode);
        return this.http.get<any>(this.baseUrl, {
            params: params,
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        }).pipe(
            // map(response => response.caminhos),  // Extract only the "caminhos" property
            catchError(err => {
                if (err.error.message) {
                    return throwError(() => new Error(err.error.message));
                } else {
                    return throwError(() => new Error(err.error));
                }
            })
        );
    }

    getTaskOrder(): Observable<PickupAndDeliveryTask[]> {
        return this.http.get<PickupAndDeliveryTask[]>(this.baseUrlMDT, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
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

    getPathAndBuildVisualization(origin: string, destination: string, sNode: string, eNode: string): (CellPath | UseElevator | UsePassageway)[] {
    	let visualizationPath: (CellPath | UseElevator | UsePassageway)[] = [];

        this.getPath(origin, destination, sNode, eNode).subscribe({
            next: (response: any) => {
                // Assuming 'caminhos' is an array property in the response
                const paths: Path[] = response.caminhos;
                const cost: number = response.Custo;

                paths.forEach(path => {
                    if (path.path) {
                        let segmentPath: CellPath = {
                            cellPath: path.path
                        }

                        for (let i = 0; i < segmentPath.cellPath.length; i++) {
                            let temp: number = segmentPath.cellPath[i][0];
                            segmentPath.cellPath[i][0] = segmentPath.cellPath[i][1];
                            segmentPath.cellPath[i][1] = temp;
                        }

                        visualizationPath.push(segmentPath);
                    }

                    if (path.elev) {
                        let nextFloor: number = Number.parseInt(path.elev[1].split("_")[1]);
                        let segmentElev: UseElevator = {
                            floor: nextFloor
                        };
                        visualizationPath.push(segmentElev);
                    }

                    if (path.cor) {
                        let segmentCor: UsePassageway = {
                            use: true
                        }
                        visualizationPath.push(segmentCor);
                    }
                });
            },
            error: (error) => {
                alert("Something wrong happened while trying to get the path!");
                return;
            }
        });

        return visualizationPath;
    }
}
