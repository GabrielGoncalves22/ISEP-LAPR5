import { Component, NgModule, OnInit } from '@angular/core';
import { BuildingService } from '../../building/building.service';
import { RoomService } from '../room.service';
import { Building } from '../../models/building.model';
import { Floor } from '../../models/floor.model';
import { Room } from '../../models/room.model';
import { catchError, of, tap } from 'rxjs';
import { FloorService } from '../../floor/floor.service';
import { FormDataHandlerService } from 'src/app/form.data.handler.service';

@Component({
    selector: 'app-room-create',
    templateUrl: './room-create.component.html',
    styleUrls: ['./room-create.component.css'],
    providers: [RoomService, BuildingService, FloorService, FormDataHandlerService],
})
export class RoomCreateComponent implements OnInit {
    possibleCategories: string[] = [
        'Gabinete',
        'Anfiteatro',
        'Laboratório',
        'Outro'
    ];

    buildings: Building[] = [];
    floors: Floor[] = [];

    room: Room = {
        name: '',
        description: '',
        category: '',
        building: '',
        floor: undefined
    };

    error: string | null = null;
    success: string | null = null;
    
    readonly itemName: string = "roomCreate";

    constructor(private roomService: RoomService, private buildingService: BuildingService, private floorService: FloorService, private formDataHandlerService: FormDataHandlerService) {}

    ngOnInit(): void {
        this.room = this.formDataHandlerService.loadSavedData(this.itemName, this.room);
        this.loadBuildings();
    }

    createRoom() {
        this.roomService.createRoom(this.room).pipe(
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
                    this.success = 'The room was successfully created';
                    this.room = {
                        name: '',
                        description: '',
                        category: '',
                        building: '',
                        floor: undefined
                    };
                    this.formDataHandlerService.destroySavedData(this.itemName);
                }
            }
        );
    }

    loadBuildings() {
        this.buildingService.getAllBuildings().subscribe({
            next: (buildings: Building[]) => {
                this.buildings = buildings;
                if (this.room.building !== "") {
                    this.loadFloorsOfBuilding();
                }
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    loadFloorsOfBuilding() {
        this.floors = [];
        this.error = null;
        if (this.room.building !== '') {
            this.floorService.getFloorsByBuilding(this.room.building).subscribe({
                next: (floors: Floor[]) => {
                    this.floors = floors;
                },
                error: (error) => {
                    this.error = error.message;
                }
            });
        }
    }

    saveData() {
        this.formDataHandlerService.saveData(this.itemName, this.room);
    }

}
