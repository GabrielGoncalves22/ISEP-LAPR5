import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceTypeCreateComponent } from './device-type/device-type-create/device-type-create.component';
import { DeviceInhibitComponent } from './device/device-inhibit/device-inhibit.component';
import { DeviceListComponent } from './device/device-list/device-list.component';
import {DeviceCreateComponent} from "./device/device-create/device-create.component";

const routes: Routes = [
    { path: 'deviceType/create', component: DeviceTypeCreateComponent },
    { path: 'device/inhibit', component: DeviceInhibitComponent },
    { path: 'device/list', component: DeviceListComponent },
    { path: 'device/create', component: DeviceCreateComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FleetRoutingModule { }
