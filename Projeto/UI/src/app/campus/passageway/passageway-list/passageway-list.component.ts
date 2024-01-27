import { Component, OnInit } from '@angular/core';
import { PassagewayService } from '../passageway.service';
import { Passageway } from '../../models/passageway.model';
import { Building } from '../../models/building.model';
import { BuildingService } from '../../building/building.service';

const availableOptions = {
    listAllPassageways: 'listAllPassageways',
    listPassagewaysBetweenTwoBuildings: 'listPassagewaysBetweenTwoBuildings',
};

@Component({
    selector: 'app-passageway-list',
    templateUrl: './passageway-list.component.html',
    styleUrls: ['./passageway-list.component.css'],
    providers: [PassagewayService, BuildingService]
})
export class PassagewayListComponent implements OnInit {
    buildings: Building[] = [];
    passageways: Passageway[] = [];
    codeBuilding1: string = '';
    codeBuilding2: string = '';
    option!: String;
    error: string | null = null;
    
    constructor(private service: PassagewayService, private buildingService : BuildingService) {}

    ngOnInit() : void {
        this.loadBuildingsCodes();
    }

    loadBuildingsCodes() : void {
        this.buildingService.getAllBuildings().subscribe({
            next: (buildings: Building[]) => {
                this.buildings = buildings;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    listPassageways() : void {
        this.passageways = [];
        if (this.option === undefined) {
            this.error = 'You need to choose an option first!';
        } else {
            this.error = null;

            switch(this.option) {
                case availableOptions.listAllPassageways:
                    this.listAllPassageways();
                    break;
                case availableOptions.listPassagewaysBetweenTwoBuildings:
                    this.listPassagewaysBetweenTwoBuildings();
                    break;
                default:
                    this.error = 'Unknown option.';
            }
        }
    }

    listAllPassageways(): void {
        this.codeBuilding1 = '';
        this.codeBuilding2 = '';
        this.service.listAllPassageways().subscribe({
            next: (passageways: Passageway[]) => {
                this.passageways = passageways;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    listPassagewaysBetweenTwoBuildings() : void {
        if (this.codeBuilding1 === '') {
            this.error = 'You need to specify both buildings first.';
        } else {
            this.service.listPassagewaysBetweenTwoBuildings(this.codeBuilding1, this.codeBuilding2).subscribe({
                next: (passageways: Passageway[]) => {
                    this.passageways = passageways;
                },
                error: (error) => {
                    this.error = error.message;
                }
            });
        }
    }
}
