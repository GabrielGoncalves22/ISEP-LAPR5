import { Component, OnInit } from '@angular/core';
import { BuildingService } from 'src/app/campus/building/building.service';
import { FloorService } from 'src/app/campus/floor/floor.service';
import { SurveillanceTask } from '../../models/surveillanceTask.model';
import { TaskService } from '../../task.service';
import { Floor } from 'src/app/campus/models/floor.model';
import { catchError, of, tap } from 'rxjs';
import { BuildingInfo } from 'src/app/campus/models/buildingInfo.model';
import { UserService } from 'src/app/user/user.service';
import { FormDataHandlerService } from 'src/app/form.data.handler.service';

@Component({
    selector: 'app-task-create-surveillance',
    templateUrl: './task-create-surveillance.component.html',
    styleUrls: ['./task-create-surveillance.component.css'],
    providers: [TaskService, BuildingService, FloorService, UserService, FormDataHandlerService]
})
export class TaskCreateSurveillanceComponent implements OnInit {
    surveillanceTask: SurveillanceTask = {
        buildingCode: "",
        surveillanceTaskFloors: [],
        emergencyContactName: "",
        emergencyContactPhoneNumber: ""
    };

    buildings: BuildingInfo[] = [];
  
    checkboxesFloors: { number: number, checked: boolean }[] = [];

    error: string | null = null;
    success: string | null = null;

    readonly itemName: string = "surveillanceTaskCreate";

    constructor(private taskService: TaskService, private buildingService: BuildingService, private floorService: FloorService, private userService: UserService, private formDataHandlerService: FormDataHandlerService) {}

    ngOnInit(): void {
        this.loadDefaultData();
        this.loadBuildings();
    }

    loadBuildings() {
        this.buildingService.getAllBuildingsInfo().subscribe({
            next: (buildings: BuildingInfo[]) => {
                this.buildings = buildings;
                if (this.surveillanceTask.buildingCode !== "") {
                    this.onBuildingChange();
                }
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    loadDefaultData() {
        this.userService.getUserData().subscribe({
            next: (userData) => {
                this.surveillanceTask.emergencyContactName = userData.name;
                this.surveillanceTask.emergencyContactPhoneNumber = userData.telephone;
                this.surveillanceTask = this.formDataHandlerService.loadSavedData(this.itemName, this.surveillanceTask);
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    createSurveillanceTask() {
        this.taskService.createSurveillanceTask(this.surveillanceTask).pipe(
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
                    this.success = 'The surveillance task was successfully created!';
                    this.surveillanceTask = {
                        buildingCode: "",
                        surveillanceTaskFloors: [],
                        emergencyContactName: "",
                        emergencyContactPhoneNumber: ""
                    };
                    this.formDataHandlerService.destroySavedData(this.itemName);
                }
            }
        );
    }

    onBuildingChange() {
        this.surveillanceTask.surveillanceTaskFloors = [];
        this.checkboxesFloors = [];

        const selectedBuilding = this.buildings.find(building => building.code === this.surveillanceTask.buildingCode);

        if (selectedBuilding) {
            this.floorService.getFloorsByBuilding(selectedBuilding.code).subscribe({
                next: (floors: Floor[]) => {
                    this.checkboxesFloors = floors.map(floor => ({ number: floor.number, checked: false }));

                    if (this.checkboxesFloors.length === 0) {
                        this.error = 'The selected building does not contain floors';
                    } else {
                        this.error = null;
                        if (this.surveillanceTask.surveillanceTaskFloors.length !== 0) {
                            this.surveillanceTask.surveillanceTaskFloors.forEach(surveillanceTaskFloor => {
                                this.onFloorSelectionChange({number: surveillanceTaskFloor, checked: true});
                            });
                        }
                        this.saveData();
                    }
                },
                error: (error) => {
                    this.error = error.message;
                }
            });
        } else {
            this.error = 'The selected building does not exist';
        }

        this.success = null;
    }

    onFloorSelectionChange(checkboxFloor: { number: number, checked: boolean }) {
        const index = this.surveillanceTask.surveillanceTaskFloors.findIndex(floor => floor === checkboxFloor.number);

        if (index === -1 && checkboxFloor.checked) {
            this.surveillanceTask.surveillanceTaskFloors.push(checkboxFloor.number);
        } else if (index !== -1 && !checkboxFloor.checked) {
            this.surveillanceTask.surveillanceTaskFloors.splice(index, 1);
        }

        this.saveData();
    }

    saveData() {
        this.formDataHandlerService.saveData(this.itemName, this.surveillanceTask);
    }

}
