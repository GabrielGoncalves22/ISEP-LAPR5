import { Component, OnInit } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ElevatorService } from '../elevator.service';
import { BuildingService } from '../../building/building.service';
import { FloorService } from '../../floor/floor.service';
import { Elevator } from '../../models/elevator.model';
import { BuildingInfo } from '../../models/buildingInfo.model';
import { Floor } from '../../models/floor.model';
import { FormDataHandlerService } from 'src/app/form.data.handler.service';

@Component({
    selector: 'app-elevator-create',
    templateUrl: './elevator-create.component.html',
    styleUrls: ['./elevator-create.component.css'],
    providers: [ElevatorService, BuildingService, FloorService, FormDataHandlerService]
})

export class ElevatorCreateComponent implements OnInit {

    elevator: Elevator = {
        brand: '',
        model: '',
        serialNumber: '',
        description: '',
        building: '',
        floors: []
    };

    buildings: BuildingInfo[] = [];

    checkboxesFloors: { number: number, checked: boolean }[] = [];

    error: Error | String | null = null;

    success: String | null = null;

    readonly itemName: string = "elevatorCreate";

    constructor(private elevatorService: ElevatorService, private buildingService: BuildingService, private floorService: FloorService, private formDataHandlerService: FormDataHandlerService) { }

    ngOnInit(): void {
        this.elevator = this.formDataHandlerService.loadSavedData(this.itemName, this.elevator);
        this.getAllBuildings();
    }

    createElevator() {
        this.elevatorService.createElevator(this.elevator).pipe(
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
                    this.success = 'The elevator was successfully created';
                    this.elevator = {
                        brand: '',
                        model: '',
                        serialNumber: '',
                        description: '',
                        building: '',
                        floors: []
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
                if (this.elevator.building !== "") {
                    this.onBuildingChange();
                    /*if (this.elevator.floors.length !== 0) {
                        this.elevator.floors.forEach(elevatorFloor => {
                            this.checkboxesFloors.forEach(cbFloor => {
                                if (elevatorFloor.number === cbFloor.number) {
                                    cbFloor.checked = true;
                                }
                            });
                        });
                    }*/
                }
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    onBuildingChange() {
        this.elevator.floors = [];
        this.checkboxesFloors = [];

        const selectedBuilding = this.buildings.find(building => building.code === this.elevator.building);

        if (selectedBuilding) {
            this.floorService.getFloorsByBuilding(selectedBuilding.code).subscribe({
                next: (floors: Floor[]) => {
                    this.checkboxesFloors = floors.map(floor => ({ number: floor.number, checked: false }));

                    if (this.checkboxesFloors.length === 0) {
                        this.error = 'The selected building does not contain floors';
                    } else {
                        this.error = null;
                        this.saveData();
                    }
                },
                error: (error) => {
                    this.error = error.message;
                }
            });
        } else {
            this.error = 'The selected building does not exist';
        }
        
        this.success = null;
    }

    onFloorSelectionChange(checkboxFloor: { number: number, checked: boolean }) {
        const index = this.elevator.floors.findIndex(floor => floor.number === checkboxFloor.number);

        if (index === -1 && checkboxFloor.checked) {
            this.elevator.floors.push({ number: checkboxFloor.number });
        } else if (index !== -1 && !checkboxFloor.checked) {
            this.elevator.floors.splice(index, 1);
        }

        //this.saveData();
    }

    saveData() {
        this.formDataHandlerService.saveData(this.itemName, this.elevator);
    }
}
