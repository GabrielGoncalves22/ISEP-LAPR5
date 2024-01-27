import { Component, OnInit } from '@angular/core';
import { BuildingService } from '../building.service';
import { Building } from 'src/app/campus/models/building.model';
import { catchError, of, tap } from 'rxjs';
import { FormDataHandlerService } from 'src/app/form.data.handler.service';

@Component({
    selector: 'app-building-create',
    templateUrl: './building-create.component.html',
    styleUrls: ['./building-create.component.css'],
    providers: [BuildingService, FormDataHandlerService]
})

export class BuildingCreateComponent implements OnInit {

    building: Building = {
        code: '',
        name: '',
        description: '',
        numXCells: undefined,
        numYCells: undefined,
    };

    error: Error | null = null;

    success: String | null = null;

    readonly itemName: string = "buildingCreate";

    constructor(private service: BuildingService, private formDataHandlerService: FormDataHandlerService) { }

    ngOnInit(): void {
        this.building = this.formDataHandlerService.loadSavedData(this.itemName, this.building);
    }

    createBuilding() {
        this.service.createBuilding(this.building).pipe(
            tap({
                error: (error) => {
                    this.error = error.message;
                    this.success = null;
                }
            }),
            catchError(
                err => of(null) // Para ser verificado no .subscribe()
            )
        ).subscribe(
            (response) => {
                if (response) {
                    this.error = null;
                    this.success = 'The building was successfully created';
                    this.building = {
                        code: '',
                        name: '',
                        description: '',
                        numXCells: undefined,
                        numYCells: undefined,
                    };
                    this.formDataHandlerService.destroySavedData(this.itemName);
                }
            }
        );
    }

    saveData() {
        this.formDataHandlerService.saveData(this.itemName, this.building);
    }

}
