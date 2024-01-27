import {Component, OnInit} from '@angular/core';
import {DeviceService} from "../device.service";
import {Device} from "../../models/device.model";
import {catchError, of, tap} from "rxjs";
import {DeviceTypeService} from "../../device-type/device-type.service";
import {DeviceType} from "../../models/deviceType.model";
import { FormDataHandlerService } from 'src/app/form.data.handler.service';

@Component({
    selector: 'app-device-create',
    templateUrl: './device-create.component.html',
    styleUrls: ['./device-create.component.css'],
    providers: [DeviceService, DeviceTypeService, FormDataHandlerService]
})
export class DeviceCreateComponent implements OnInit {

    device: Device = {
        code: "",
        description: "",
        nickname: "",
        serialNumber: "",
        type: ""
    }

    deviceTypes: DeviceType[] = [];

    error: Error | null = null;

    success: String | null = null;

    readonly itemName: string = "deviceCreate";

    constructor(private deviceService: DeviceService, private deviceTypeService: DeviceTypeService, private formDataHandlerService: FormDataHandlerService) {}

    ngOnInit(): void {

        this.device = this.formDataHandlerService.loadSavedData(this.itemName, this.device);
        //this.getDeviceTypes();
    }

    createDevice() {
        this.deviceService.createDevice(this.device).pipe(
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
                    this.error = null;
                    this.success = 'The device was successfully created';
                    this.device = {
                        code: "",
                        description: "",
                        nickname: "",
                        serialNumber: "",
                        type: ""
                    }
                    this.formDataHandlerService.destroySavedData(this.itemName);
                }
            }
        );
    }

    //not implemented
    getDeviceTypes() {
        this.deviceTypeService.getAllDeviceTypes().subscribe({
            next: (deviceTypes: DeviceType[]) => {
                this.deviceTypes = deviceTypes;
            },
            error: (error) => {
                this.error = error.message;
            }
        })
    }

    saveData() {
        this.formDataHandlerService.saveData(this.itemName, this.device);
    }

}
