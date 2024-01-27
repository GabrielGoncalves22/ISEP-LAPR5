import { Component, OnInit } from '@angular/core';
import {PathService} from "../path.service";
import {Path} from "../../models/path.model";
import {BuildingInfo} from "../../../campus/models/buildingInfo.model";
import {BuildingService} from "../../../campus/building/building.service";

@Component({
    selector: 'app-path-list',
    templateUrl: './path-list.component.html',
    styleUrls: ['./path-list.component.css'],
    providers: [PathService, BuildingService]
})
export class PathListComponent implements OnInit {

    constructor(private pathService: PathService, private buildingService: BuildingService) { }
    // constructor() { }

    buildings: BuildingInfo[] = [];
    selectedBuilding1: string = '';
    selectedBuilding2: string = '';
    selectedCel1: string = '';
    selectedCel2: string = '';

    paths: Path[] = [];
    cost: number = 0;

    error: String | null = null;

    ngOnInit() {
        this.getAllBuildings();
        // this.getPath();
    }

    getPath() {
        this.pathService.getPath(this.selectedBuilding1, this.selectedBuilding2, this.selectedCel1, this.selectedCel2).subscribe({
            next: (response: any) => {
                // Assuming 'caminhos' is an array property in the response
                this.paths = response.caminhos;
                this.cost = response.Custo;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
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
}
