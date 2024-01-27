import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../device.service';
import { Device } from 'src/app/fleet/models/device.model';

@Component({
    selector: 'app-device-list',
    templateUrl: './device-list.component.html',
    styleUrls: ['./device-list.component.css'],
    providers: [DeviceService]
})

export class DeviceListComponent implements OnInit {
    devices: Device[] = [];

    error: String | null = null;

    constructor(private service: DeviceService) { }

    ngOnInit(): void {
        this.listAllDevices();
    }    

    listAllDevices() {
        this.service.getAllDevices().subscribe({
            next: (devices: Device[]) => {
                this.devices = devices;
            },
            error: (error) => {
                this.error = error.message;
            }
        });
    }

}
