import { Component, OnInit } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { DeviceTypeService } from '../device-type.service';
import { DeviceType } from 'src/app/fleet/models/deviceType.model';
import { FormDataHandlerService } from 'src/app/form.data.handler.service';

@Component({
    selector: 'app-device-type-create',
    templateUrl: './device-type-create.component.html',
    styleUrls: ['./device-type-create.component.css'],
    providers: [DeviceTypeService, FormDataHandlerService]
})

export class DeviceTypeCreateComponent implements OnInit {

    deviceType: DeviceType = {
        type: '',
        brand: '',
        model: '',
        taskTypes: []
    };

    checkboxesTaskTypes = [
        { id: 'Surveillance', name: 'Surveillance', value: 0, checked: false },
        { id: 'Transport', name: 'Transport', value: 1, checked: false }
    ];

    error: Error | null = null;

    success: String | null = null;
    
    readonly itemName: string = "DeviceTypeCreate";

    constructor(private service: DeviceTypeService, private formDataHandlerService: FormDataHandlerService) { }

    ngOnInit(): void {
        this.loadPreFilledData();
    }

    loadPreFilledData() {
        this.deviceType = this.formDataHandlerService.loadSavedData(this.itemName, this.deviceType);
        if (this.deviceType.taskTypes.length !== 0) {
            this.deviceType.taskTypes.forEach(taskType => {
                this.checkboxesTaskTypes.forEach(checkBoxTaskType => {
                    if (taskType === checkBoxTaskType.value) {
                        checkBoxTaskType.checked = true;
                    }
                });
            });
        }
    }

    createDeviceType() {
        this.service.createDeviceType(this.deviceType).pipe(
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
                    this.success = 'The device type was successfully created';
                    this.deviceType = {
                        type: '',
                        brand: '',
                        model: '',
                        taskTypes: []
                    };
                    this.formDataHandlerService.destroySavedData(this.itemName);
                }
            }
        );
    }

    onCheckboxChange(value: boolean, index: number) {
        this.checkboxesTaskTypes[index].checked = value;
        this.deviceType.taskTypes = this.getCheckedValues().map(value => value);
        this.saveData();
    }

    getCheckedValues() {
        return this.checkboxesTaskTypes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    }

    saveData() {
        this.formDataHandlerService.saveData(this.itemName, this.deviceType);
    }
}
