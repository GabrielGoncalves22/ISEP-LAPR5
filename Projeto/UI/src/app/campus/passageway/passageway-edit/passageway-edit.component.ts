import { Component, OnInit } from '@angular/core';
import { PassagewayService } from '../passageway.service';
import { Passageway } from 'src/app/campus/models/passageway.model';
import { catchError, of, tap } from 'rxjs';
import { Floor } from '../../models/floor.model';
import { FloorService } from '../../floor/floor.service';
import { Building } from '../../models/building.model';
import { BuildingService } from '../../building/building.service';

@Component({
    selector: 'app-passageway-edit',
    templateUrl: './passageway-edit.component.html',
    styleUrls: ['./passageway-edit.component.css'],
    providers: [PassagewayService, FloorService, BuildingService]
})

export class PassagewayEditComponent implements OnInit {
    passageway: Passageway = {
        building1: '',
        floor1: null as any,
        building2: '',
        floor2: null as any
    };

    floor: Floor = {
        number: null as any,
        description: ''
    };

    floors1: Floor[] = [];

    floors2: Floor[] = [];

    buildings: Building[] = [];

    passageways: Passageway[] = [];

    selectedBuildingCode1: string = null as any;

    selectedFloorNumber1: number = null as any;

    selectedBuildingCode2: string = null as any;

    selectedFloorNumber2: number = null as any;

    selectedPassageway: string = null as any;

    error: String | null = null;

    success: String | null = null;

    constructor(private service: PassagewayService, private floorService: FloorService , private buildingService: BuildingService) { }

    ngOnInit(): void {
        this.listAllPassageways();
        this.getAllBuildings();
    }

    editPassageway() {
        this.passageway = {  building1: this.selectedBuildingCode1, floor1: this.selectedFloorNumber1, building2: this.selectedBuildingCode2, floor2: this.selectedFloorNumber2 }; // Limpa os dados atuais
        this.service.updatePassageway(this.passageway, this.selectedPassageway).pipe(
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
                    this.listAllPassageways();
                    this.error = null;
                    this.success = 'The passageway was successfully edited';
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

    listAllPassageways(): void {
        this.passageway.building1 = '';
        this.passageway.floor1 = null as any;
        this.passageway.building2 = '';
        this.passageway.floor2 = null as any;
        this.service.listAllPassageways().subscribe({
            next: (passageways: Passageway[]) => {
                this.passageways = passageways;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    loadFloorsOfBuilding1() {
        this.floors1 = [];
        this.floor = { number: null as any, description: ''}; // Limpa os dados atuais
        this.error = null;
    
        if (this.selectedBuildingCode1 !== '') {
            this.floorService.getFloorsByBuilding(this.selectedBuildingCode1).subscribe({
                next: (floors: Floor[]) => {
                    this.floors1 = floors;
                },
                error: (error) => {
                    this.error = error.message;
                }
            });
        }
    }

    loadFloorsOfBuilding2() {
        this.floors2 = [];
        this.floor = { number: null as any, description: ''}; // Limpa os dados atuais
        this.error = null;
    
        if (this.selectedBuildingCode2 !== '') {
            this.floorService.getFloorsByBuilding(this.selectedBuildingCode2).subscribe({
                next: (floors: Floor[]) => {
                    this.floors2 = floors;
                },
                error: (error) => {
                    this.error = error.message;
                }
            });
        }
    }

    loadPassagewayDetails() {
        this.error = null;

        if (this.selectedPassageway) {
            const selectedPassageway = this.passageways.find(passageway => passageway.code === this.selectedPassageway);

            if (selectedPassageway) {
                this.selectedBuildingCode1 = selectedPassageway.building1;
                this.selectedFloorNumber1 = selectedPassageway.floor1;
                this.loadFloorsOfBuilding1();
                this.selectedBuildingCode2 = selectedPassageway.building2;
                this.selectedFloorNumber2 = selectedPassageway.floor2;
                this.loadFloorsOfBuilding2();
            } else {
                this.error = 'Passageway not found'; // Mensagem de erro se o andar não for encontrado
            }
        }
    }
}
