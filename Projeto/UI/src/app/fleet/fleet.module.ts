import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';

import { FleetRoutingModule } from './fleet-routing.module';
import { FleetComponent } from './fleet.component';
import { DeviceTypeCreateComponent } from './device-type/device-type-create/device-type-create.component';
import { DeviceInhibitComponent } from './device/device-inhibit/device-inhibit.component';
import { DeviceListComponent } from './device/device-list/device-list.component';
import { DeviceCreateComponent } from './device/device-create/device-create.component';


@NgModule({
    declarations: [
        FleetComponent,
        DeviceTypeCreateComponent,
        DeviceInhibitComponent,
        DeviceListComponent,
        DeviceCreateComponent
    ],
    imports: [
        CommonModule,
        FleetRoutingModule,
        HttpClientModule,
        FormsModule
    ]
})

export class FleetModule { }
