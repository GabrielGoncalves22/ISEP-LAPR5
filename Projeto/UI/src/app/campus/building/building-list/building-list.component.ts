import { Component, OnInit } from '@angular/core';
import { BuildingService } from '../building.service';
import { BuildingInfo } from 'src/app/campus/models/buildingInfo.model';

const availableOptions = {
    allBuildings: 'allBuildings',
    buildingsWithNumFloorBetweenMinAndMax: 'buildingsWithNumFloorBetweenMinAndMax'
};

@Component({
    selector: 'app-building-list',
    templateUrl: './building-list.component.html',
    styleUrls: ['./building-list.component.css'],
    providers: [BuildingService]
})
export class BuildingListComponent implements OnInit {

    buildings: BuildingInfo[] = [];
    option!: String;
    minNumberOfFloors: Number | null = null;
    maxNumberOfFloors: Number | null = null;

    error: String | null = null;

    constructor(private service: BuildingService) { }

    ngOnInit(): void {
    }

    listBuildings() {
        this.buildings = [];
        if (this.option === undefined) {
            this.error = 'You need to choose an option first!';
        } else {
            this.error = null;

            switch (this.option) {
                case availableOptions.allBuildings:
                    this.listAllBuildings();
                    break;
                case availableOptions.buildingsWithNumFloorBetweenMinAndMax:
                    this.listBuildingsWithNumFloorsBetweenMinAndMax();
                    break;
                default:
                    this.error = 'Unknown option.';
            }
        }
    }

    listAllBuildings() {
        this.service.getAllBuildingsInfo().subscribe({
            next: (buildings: BuildingInfo[]) => {
                this.buildings = buildings;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    listBuildingsWithNumFloorsBetweenMinAndMax() {
        if (this.maxNumberOfFloors === null || this.minNumberOfFloors === null) {
            this.error = 'You need to fill both minimum and maximum number.';
        } else {
            this.service.getBuildingsWithNumberFloorsBetweenMinAndMax(Number(this.minNumberOfFloors), Number(this.maxNumberOfFloors)).subscribe({
                next: (buildings: BuildingInfo[]) => {
                    this.buildings = buildings;
                },
                error: (error) => {
                    this.error = error.message;
                }
            });
        }
    }
}
