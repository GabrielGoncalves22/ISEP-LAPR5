import { Component, OnInit } from '@angular/core';
import { FloorService } from '../floor.service';
import { Floor } from 'src/app/campus/models/floor.model';
import { BuildingService } from '../../building/building.service';
import { Building } from '../../models/building.model';
import { catchError, of, tap } from 'rxjs';

@Component({
    selector: 'app-floor-edit',
    templateUrl: './floor-edit.component.html',
    styleUrls: ['./floor-edit.component.css'],
    providers: [FloorService, BuildingService]
})

export class FloorEditComponent implements OnInit {
    floor: Floor = {
        number: null as any,
        description: ''
    };

    buildings: Building[] = [];

    floors: Floor[] = [];

    buildingCode!: string;

    selectedBuildingCode: string = null as any;

    selectedFloorNumber: string = null as any;

    error: String | null = null;

    success: String | null = null;

    constructor(private service: FloorService, private buildingService: BuildingService) { }

    ngOnInit(): void {
        this.getAllBuildings();
    }

    editFloor() {
        this.service.updateFloor(this.floor, this.selectedBuildingCode, this.selectedFloorNumber).pipe(
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
                    this.success = 'The floor was successfully edited';
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

    loadFloorsOfBuilding() {
        this.floors = [];
        this.floor = { number: null as any, description: ''}; // Limpa os dados atuais
        this.error = null;
    
        if (this.selectedBuildingCode !== '') {
            this.service.getFloorsByBuilding(this.selectedBuildingCode).subscribe({
                next: (floors: Floor[]) => {
                    this.floors = floors;
                },
                error: (error) => {
                    this.error = error.message;
                }
            });
        }
    }

    loadFloorDetails() {
        this.floor = { number: null as any, description: ''}; // Limpa os dados atuais
        this.error = null;
    
        if (this.selectedFloorNumber) {
            const selectedFloor = this.floors.find(floor => floor.number.toString() === this.selectedFloorNumber);
    
            if (selectedFloor) {
                // Se o andar for encontrado na lista, atribui os detalhes ao modelo
                this.floor.number = selectedFloor.number;
                this.floor.description = selectedFloor.description;
            } else {
                this.error = 'Floor not found'; // Mensagem de erro se o andar não for encontrado
            }
        }
    }

}
