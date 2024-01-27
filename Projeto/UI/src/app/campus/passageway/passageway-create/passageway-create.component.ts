import { Component, OnInit } from '@angular/core';
import { PassagewayService } from "../passageway.service";
import { Passageway } from "../../models/passageway.model";
import { catchError, of, tap } from "rxjs";
import { BuildingService } from "../../building/building.service";
import { Building } from "../../models/building.model";
import { Floor } from "../../models/floor.model";
import { FloorService } from "../../floor/floor.service";
import { FormDataHandlerService } from 'src/app/form.data.handler.service';

@Component({
    selector: 'app-passageway-create',
    templateUrl: './passageway-create.component.html',
    styleUrls: ['./passageway-create.component.css'],
    providers: [PassagewayService, BuildingService, FloorService, FormDataHandlerService]
})

export class PassagewayCreateComponent implements OnInit {

    passageway: Passageway = {
        building1: '',
        floor1: 0,
        building2: '',
        floor2: 0
    }

    floorsBuilding1: Floor[] = [];
    floorsBuilding2: Floor[] = [];

    buildings: Building[] = [];

    error: Error | null = null;
    success: String | null = null;

    readonly itemName: string = "passagewayCreate";

    constructor(private passagewayService: PassagewayService,
        private buildingService: BuildingService,
        private floorService: FloorService,
        private formDataHandlerService: FormDataHandlerService) {
    }

    ngOnInit(): void {
        this.passageway = this.formDataHandlerService.loadSavedData(this.itemName, this.passageway);
        this.getAllBuildings();
    }

    createPassageway() {
        this.passagewayService.createPassageway(this.passageway).pipe(
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
                    this.success = 'The passageway was successfully created';
                    this.passageway = {
                        building1: '',
                        floor1: 0,
                        building2: '',
                        floor2: 0
                    }
                    this.formDataHandlerService.destroySavedData(this.itemName);
                }
            }
        );
    }

    getAllBuildings() {
        this.buildingService.getAllBuildings().subscribe({
            next: (buildings: Building[]) => {
                this.buildings = buildings;
                if (this.passageway.building1 !== "") {
                    this.listAllFloors(this.passageway.building1, 0);
                }

                if (this.passageway.building2 !== "") {
                    this.listAllFloors(this.passageway.building2, 1);
                }
            },
            error: (error) => {
                console.error('Error fetching buildings:', error);
            }
        });
    }

    listAllFloors(buildingCode: string, index: number) {
        this.error = null;
        if (buildingCode !== "") {
            this.floorService.getFloorsByBuilding(buildingCode).subscribe({
                next: (floors: Floor[]) => {
                    if (index === 0) {
                        this.floorsBuilding1 = floors;
                    } else if (index === 1) {
                        this.floorsBuilding2 = floors;
                    }
                    this.saveData();
                },
                error: (error) => {
                    this.error = error.message;
                }
            });
        } else {
            if (index === 0) {
                this.floorsBuilding1 = [];
            } else if (index === 1) {
                this.floorsBuilding2 = [];
            }
        }
    }

    saveData() {
        this.formDataHandlerService.saveData(this.itemName, this.passageway);
    }
}
