import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { catchError, of, tap } from 'rxjs';
import { Building } from '../../models/building.model';
import { Floor } from '../../models/floor.model';
import { BuildingService } from '../../building/building.service';
import { FloorService } from '../../floor/floor.service';

@Component({
    selector: 'app-map-load',
    templateUrl: './map-load.component.html',
    styleUrls: ['./map-load.component.css'],
    providers: [MapService, BuildingService, FloorService]
})
export class MapLoadComponent implements OnInit {

    buildings: Building[] = [];
    floors: Floor[] = [];

    selectedBuilding: string = '';
    selectedFloor: number | undefined;
    selectedFile: File | null = null;

    error: string | null = null;

    success: string | null = null;

    constructor(private service: MapService, private buildingService: BuildingService, private floorService: FloorService) {}

    ngOnInit() : void {
        this.loadBuildings();
    }

    loadBuildings() {
        this.buildingService.getAllBuildings().subscribe({
            next: (buildings: Building[]) => {
                this.buildings = buildings;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    loadFloorsOfBuilding() {
        this.floors = [];
        this.error = null;
        this.selectedFloor = undefined;
        if (this.selectedBuilding !== '') {
            this.floorService.getFloorsByBuilding(this.selectedBuilding).subscribe({
                next: (floors: Floor[]) => {
                    this.floors = floors;
                },
                error: (error) => {
                    this.error = error.message;
                }
            });
        }
    }

    onFileChange(event: any): void {
        this.selectedFile = event.target.files[0] as File;
    }

    loadMap() {
        this.error = null;
        this.success = null;

        if (this.selectedBuilding === '') {
            this.error = 'Please, choose a building.';
        } else if (this.selectedFloor === undefined) {
            this.error = 'Please, choose the floor of the building.';
        } else if (!this.selectedFile) {
            this.error = 'Please, select a file.';
        } else {
            this.service.loadMap(this.selectedBuilding, this.selectedFloor, this.selectedFile).pipe(
                tap({
                    error: (error) => {
                        this.error = error.message;
                        this.success = null;
                    }
                }),
                catchError(
                    err => of(null) // Para ser verificado no .subscribe()
                )
            ).subscribe(
                (response) => {
                    if (response) {
                        this.error = null;
                        this.success = 'The map was successfully loaded.';
                    }
                }
            );
        }

    }

}
