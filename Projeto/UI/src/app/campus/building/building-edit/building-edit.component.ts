import { Component, OnInit } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { BuildingService } from '../building.service';
import { Building } from '../../models/building.model';

@Component({
    selector: 'app-building-edit',
    templateUrl: './building-edit.component.html',
    styleUrls: ['./building-edit.component.css'],
    providers: [BuildingService]
})

export class BuildingEditComponent implements OnInit {

    building: Building = {
        name: '',
        description: '',
        numXCells: null as any,
        numYCells: null as any
    };

    buildings: Building[] = [];

    selectedBuildingCode: string = null as any;

    error: Error | String | null = null;

    success: String | null = null;

    constructor(private service: BuildingService) { }

    ngOnInit(): void {
        this.getAllBuildings();
    }

    editBuilding() {
        const selectedBuilding = this.buildings.find(building => building.code === this.selectedBuildingCode);

        if (selectedBuilding) {
            const updatedBuilding = this.buildUpdatedBuilding(selectedBuilding);
            const numChanges = Object.keys(updatedBuilding).length;

            if (updatedBuilding && numChanges === Object.keys(this.building).length) {
                /* Faz o put como todos os campos foram alterados */
                this.updateBuilding(updatedBuilding, true);
            } else if (numChanges > 0) {
                /* Faz o patch como houve campos alterados, mas não foram todos */
                this.updateBuilding(updatedBuilding, false);
            } else {
                this.error = 'No changes detected in the building';
                this.success = null;
            }
        }
    }

    getAllBuildings() {
        this.service.getAllBuildings().subscribe({
            next: (buildings: Building[]) => {
                this.buildings = buildings;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    onBuildingChange() {
        const selectedBuilding = this.buildings.find(building => building.code === this.selectedBuildingCode);

        if (selectedBuilding) {
            this.building = {
                name: selectedBuilding.name,
                description: selectedBuilding.description,
                numXCells: selectedBuilding.numXCells,
                numYCells: selectedBuilding.numYCells
            };

            this.error = null;
            this.success = null;
        } else {
            this.building = {
                name: '',
                description: '',
                numXCells: null as any,
                numYCells: null as any
            };

            this.error = 'The selected building does not exist';
            this.success = null;
        }
    }

    private buildUpdatedBuilding(selectedBuilding: Building): Building {
        /* Para construir um objecto do edifício apenas com os campos alterados */
        let updatedBuilding: Building = {};

        if (this.building.name !== selectedBuilding.name) {
            updatedBuilding = { ...updatedBuilding, name: this.building.name };
        }

        if (this.building.description !== selectedBuilding.description) {
            updatedBuilding = { ...updatedBuilding, description: this.building.description };
        }

        if (this.building.numXCells !== selectedBuilding.numXCells) {
            updatedBuilding = { ...updatedBuilding, numXCells: this.building.numXCells };
        }

        if (this.building.numYCells !== selectedBuilding.numYCells) {
            updatedBuilding = { ...updatedBuilding, numYCells: this.building.numYCells };
        }

        return updatedBuilding;
    }

    private updateBuilding(updatedBuilding: Building, isPut: boolean) {
        this.service.updateBuilding(updatedBuilding, this.selectedBuildingCode, isPut).pipe(
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
                    this.success = 'The building was successfully edited';
                }
            }
        );
    }
}
