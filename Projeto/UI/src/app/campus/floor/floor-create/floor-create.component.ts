import { Component, OnInit } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { FloorService } from '../floor.service';
import { BuildingService } from '../../building/building.service';
import { Floor } from 'src/app/campus/models/floor.model';
import { BuildingInfo } from '../../models/buildingInfo.model';
import { FormDataHandlerService } from 'src/app/form.data.handler.service';

@Component({
    selector: 'app-floor-create',
    templateUrl: './floor-create.component.html',
    styleUrls: ['./floor-create.component.css'],
    providers: [FloorService, BuildingService, FormDataHandlerService]
})

export class FloorCreateComponent implements OnInit {

    floor: Floor = {
        number: null as any,
        description: '',
        building: ''
    };

    buildings: BuildingInfo[] = [];

    error: Error | null = null;

    success: String | null = null;

    readonly itemName: string = "floorCreate";

    constructor(private floorService: FloorService, private buildingService: BuildingService, private formDataHandlerService: FormDataHandlerService) { }

    ngOnInit(): void {
        this.floor = this.formDataHandlerService.loadSavedData(this.itemName, this.floor);
        this.getAllBuildings();
    }

    createFloor() {
        this.floorService.createFloor(this.floor).pipe(
            tap({
                error: (error) => {
                    this.error = error.message;
                    this.success = null;
                }
            }),
            catchError(
                err => of(null)
            )
        ).subscribe(
            (response) => {
                if (response) {
                    this.error = null;
                    this.success = 'The floor was successfully created';
                    this.floor = {
                        number: null as any,
                        description: '',
                        building: ''
                    };
                    this.formDataHandlerService.destroySavedData(this.itemName);
                }
            }
        );
    }

    getAllBuildings() {
        this.buildingService.getAllBuildingsInfo().subscribe({
            next: (buildings: BuildingInfo[]) => {
                this.buildings = buildings;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    saveData() {
        this.formDataHandlerService.saveData(this.itemName, this.floor);
    }
}
