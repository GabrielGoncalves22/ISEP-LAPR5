import { Component, OnInit } from '@angular/core';
import { PickupAndDeliveryTask } from '../../models/pickupAndDeliveryTask.model';
import { UserService } from 'src/app/user/user.service';
import { TaskService } from '../../task.service';
import { Room } from 'src/app/campus/models/room.model';
import { catchError, of, tap } from 'rxjs';
import { RoomService } from 'src/app/campus/room/room.service';
import { FormDataHandlerService } from 'src/app/form.data.handler.service';

@Component({
    selector: 'app-task-create-pickup-and-delivery',
    templateUrl: './task-create-pickup-and-delivery.component.html',
    styleUrls: ['./task-create-pickup-and-delivery.component.css'],
    providers: [TaskService, UserService, RoomService, FormDataHandlerService]
})
export class TaskCreatePickupAndDeliveryComponent implements OnInit {
    pickupAndDeliveryTask: PickupAndDeliveryTask = {
        pickupContactName: "",
        pickupContactPhoneNumber: "",
        deliveryContactName: "",
        deliveryContactPhoneNumber: "",
        taskDescription: "",
        confirmationCode: "",
        pickupBuildingCode: "",
        pickupRoomName: "",
        deliveryBuildingCode: "",
        deliveryRoomName: ""
    };

    rooms: Room[] = [];
  
    error: string | null = null;
    success: string | null = null;

    readonly itemName: string = "pickupAndDeliveryTaskCreate";

    constructor(private taskService: TaskService, private userService: UserService, private roomService: RoomService, private formDataHandlerService: FormDataHandlerService) {}

    ngOnInit(): void {
        this.loadDefaultData();
        this.loadRooms();
    }

    loadDefaultData() {
        this.userService.getUserData().subscribe({
            next: (userData) => {
                this.pickupAndDeliveryTask.deliveryContactName = userData.name;
                this.pickupAndDeliveryTask.deliveryContactPhoneNumber = userData.telephone;
                this.pickupAndDeliveryTask.pickupContactName = userData.name;
                this.pickupAndDeliveryTask.pickupContactPhoneNumber = userData.telephone;
                this.pickupAndDeliveryTask = this.formDataHandlerService.loadSavedData(this.itemName, this.pickupAndDeliveryTask);
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    loadRooms() {
        this.roomService.getAllRooms().subscribe({
            next: (rooms: Room[]) => {
                this.rooms = rooms;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

    createPickupAndDeliveryTask() {
        this.taskService.createPickupAndDeliveryTask(this.pickupAndDeliveryTask).pipe(
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
                    this.success = 'The pickup and delivery task was successfully created!';
                    this.pickupAndDeliveryTask = {
                        pickupContactName: "",
                        pickupContactPhoneNumber: "",
                        deliveryContactName: "",
                        deliveryContactPhoneNumber: "",
                        taskDescription: "",
                        confirmationCode: "",
                        pickupBuildingCode: "",
                        pickupRoomName: "",
                        deliveryBuildingCode: "",
                        deliveryRoomName: ""
                    };
                    this.formDataHandlerService.destroySavedData(this.itemName);
                }
            }
        );
    }

    onPickupRoomChange() {
        this.pickupAndDeliveryTask.pickupBuildingCode = "";
        let room = this.rooms.find(room => room.name === this.pickupAndDeliveryTask.pickupRoomName);
        if (room !== undefined) {
            this.pickupAndDeliveryTask.pickupBuildingCode = room.building;
            this.saveData();
        }
    }

    onDeliveryRoomChange() {
        this.pickupAndDeliveryTask.deliveryBuildingCode = "";
        let room = this.rooms.find(room => room.name === this.pickupAndDeliveryTask.deliveryRoomName);
        if (room !== undefined) {
            this.pickupAndDeliveryTask.deliveryBuildingCode = room.building;
            this.saveData();
        }
    }

    saveData() {
        this.formDataHandlerService.saveData(this.itemName, this.pickupAndDeliveryTask);
    }

}
