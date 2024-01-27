import { Component, OnInit } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { DeviceService } from '../device.service';
import { Device } from '../../models/device.model';

@Component({
    selector: 'app-device-inhibit',
    templateUrl: './device-inhibit.component.html',
    styleUrls: ['./device-inhibit.component.css'],
    providers: [DeviceService]
})

export class DeviceInhibitComponent implements OnInit {

    devices: Device[] = [];

    selectedDevice: string = '';

    buttonLabel: string | null = null;

    error: Error | string | null = null;

    success: String | null = null;

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

    onDeviceSelect() {
        let device = this.devices.find(device => device.code === this.selectedDevice) || null;

        if (device) {
            if (device.status === 'Active') {
                this.buttonLabel = 'Inhibit';
            } else {
                this.buttonLabel = 'Disinhibit';
            }
        } else {
            this.buttonLabel = null;
        }

        this.error = null;
        this.success = null;
    }

    inhibitDevice() {
        this.service.updateStateDevice(this.selectedDevice).pipe(
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
                    if (response.status === 'Active') {
                        this.buttonLabel = 'Inhibit';
                        this.success = 'The device was successfully disinhibited';
                    } else {
                        this.buttonLabel = 'Disinhibit';
                        this.success = 'The device was successfully inhibited';
                    }
                }
            }
        );
    }
}
