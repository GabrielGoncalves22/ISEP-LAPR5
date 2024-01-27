import { Component, OnInit } from '@angular/core';
import { ElevatorService } from '../elevator.service';
import { BuildingService } from '../../building/building.service';
import { Elevator } from '../../models/elevator.model';
import { BuildingInfo } from '../../models/buildingInfo.model';

@Component({
    selector: 'app-elevator-list',
    templateUrl: './elevator-list.component.html',
    styleUrls: ['./elevator-list.component.css'],
    providers: [ElevatorService, BuildingService]
})

export class ElevatorListComponent implements OnInit {

    elevator: Elevator = null as any;

    buildings: BuildingInfo[] = [];

    selectedBuilding: string = '';

    error: Error | string | null = null;

    constructor(private elevatorService: ElevatorService, private buildingService: BuildingService) { }

    ngOnInit(): void {
        this.getAllBuildings();
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

    listElevator() {
        if (this.selectedBuilding) {
            this.elevatorService.getElevatorByBuilding(this.selectedBuilding).subscribe({
                next: (elevator: Elevator) => {
                    this.error = null;
                    this.elevator = elevator;
                    this.elevator.building = this.selectedBuilding;
                },
                error: (error) => {
                    this.error = error.message;
                    this.elevator = null as any;
                }
            });
        } else {
            this.error = 'Building code is required';
        }
    }
}
