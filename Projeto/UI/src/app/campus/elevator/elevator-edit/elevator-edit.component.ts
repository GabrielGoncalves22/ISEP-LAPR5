import {Component, OnInit} from '@angular/core';
import {ElevatorService} from '../elevator.service';
import {Elevator} from 'src/app/campus/models/elevator.model';
import {BuildingService} from '../../building/building.service';
import {Building} from '../../models/building.model';
import {catchError, of, tap} from 'rxjs';

@Component({
    selector: 'app-elevator-edit',
    templateUrl: './elevator-edit.component.html',
    styleUrls: ['./elevator-edit.component.css'],
    providers: [ElevatorService, BuildingService]
})

export class ElevatorEditComponent implements OnInit {
    elevator: Elevator = {
        brand: '',
        model: '',
        serialNumber: '',
        description: '',
        building: '',
        floors: []
    };

    buildings: Building[] = [];

    buildingCode!: string;

    selectedBuildingCode: string = '';

    error: string | null = null;

    success: string | null = null;

    constructor(private elevatorService: ElevatorService, private buildingService: BuildingService) {
    }

    ngOnInit(): void {
        this.getAllBuildings();
    }

    editElevator() {
        this.elevatorService.patchElevator(this.elevator, this.selectedBuildingCode).pipe(
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
                    this.getAllBuildings();
                    this.error = null;
                    this.success = 'The elevator was successfully edited';
                }
            }
        );
    }

    getAllBuildings() {
        this.buildingService.getAllBuildings().subscribe({
            next: (buildings: Building[]) => {
                this.buildings = buildings;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    loadElevatorDetails() {
        this.elevator = {brand: '', model: '', serialNumber: '', description: '', building: '', floors: []}; // Clear current data
        this.error = null;

        if (!this.buildings.find(building => building.code === this.selectedBuildingCode)) {
            this.error = 'building does not exist.';
            return;
        }

        this.elevatorService.getElevatorByBuilding(this.selectedBuildingCode).subscribe({
            next: (elevator: Elevator) => {
                if (elevator) {
                    // If an elevator is found for the building, assign the details to the model
                    this.elevator = {...elevator}; // Copy the elevator details to avoid reference issues
                } else {
                    this.error = 'Elevator not found for the selected building';
                }
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }
}
