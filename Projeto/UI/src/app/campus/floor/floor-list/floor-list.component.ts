import { Component, OnInit } from '@angular/core';
import { FloorService } from '../floor.service';
import { Floor } from 'src/app/campus/models/floor.model';
import { BuildingService } from '../../building/building.service';
import { Building } from '../../models/building.model';

const availableOptions = {
    allFloors: 'allFloors',
    getFloorsWithPassagewaysToBuildingByBuilding: 'floorsWithPassageway'
};

@Component({
    selector: 'app-floor-list',
    templateUrl: './floor-list.component.html',
    styleUrls: ['./floor-list.component.css'],
    providers: [FloorService, BuildingService]
})

export class FloorListComponent implements OnInit {
    floors: Floor[] = [];
    floorsConnected: Floor[][] = [];
    option!: String;
    buildingCode!: string;

    error: String | null = null;
    buildings!: Building[];

    constructor(private service: FloorService, private buildingService: BuildingService) { }

    ngOnInit(): void {
        this.getAllBuildings();
    }

    listFloors() {
        this.floors = [];
        this.floorsConnected = [];
        if (this.option === undefined) {
            this.error = 'You need to choose an option first!';
        } else {
            this.error = null;

            switch (this.option) {
                case availableOptions.allFloors:
                    this.listAllFloors();
                    break;
                case availableOptions.getFloorsWithPassagewaysToBuildingByBuilding:
                   this.getFloorsWithPassagewaysToBuildingByBuilding();
                   break;
                default:
                    this.error = 'Unknown option.';
            }
        }
    }

    listAllFloors() {
        this.service.getFloorsByBuilding(this.buildingCode).subscribe({
            next: (floors: Floor[]) => {
                this.floors = floors;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
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

    getFloorsWithPassagewaysToBuildingByBuilding() {
        this.service.getFloorsWithPassagewaysToBuildingByBuilding(this.buildingCode).subscribe({
                next: (floors: Floor[][]) => {
                    this.floorsConnected = floors;
                },
                error: (error) => {
                    this.error = error.message;
                }
            }
        )
    }

}
