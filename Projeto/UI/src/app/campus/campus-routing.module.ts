import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuildingCreateComponent } from './building/building-create/building-create.component';
import { BuildingEditComponent } from './building/building-edit/building-edit.component';
import { BuildingListComponent } from './building/building-list/building-list.component';
import { FloorCreateComponent } from './floor/floor-create/floor-create.component';
import { FloorEditComponent } from './floor/floor-edit/floor-edit.component';
import { FloorListComponent } from './floor/floor-list/floor-list.component';
import { ElevatorCreateComponent } from './elevator/elevator-create/elevator-create.component';
import { ElevatorListComponent } from './elevator/elevator-list/elevator-list.component';
import { PassagewayCreateComponent } from "./passageway/passageway-create/passageway-create.component";
import { PassagewayEditComponent } from "./passageway/passageway-edit/passageway-edit.component";
import { PassagewayListComponent } from './passageway/passageway-list/passageway-list.component';
import { RoomCreateComponent } from './room/room-create/room-create.component';
import { MapLoadComponent } from './map/map-load/map-load.component';
import {ElevatorEditComponent} from "./elevator/elevator-edit/elevator-edit.component";

const routes: Routes = [
    { path: 'building/create', component: BuildingCreateComponent },
    { path: 'building/edit', component: BuildingEditComponent },
    { path: 'building/list', component: BuildingListComponent },
    { path: 'floor/create', component: FloorCreateComponent },
    { path: 'floor/edit', component: FloorEditComponent },
    { path: 'floor/list', component: FloorListComponent },
    { path: 'elevator/create', component: ElevatorCreateComponent },
    { path: 'elevator/list', component: ElevatorListComponent },
    { path: 'elevator/edit', component: ElevatorEditComponent },
    { path: 'passageway/create', component: PassagewayCreateComponent},
    { path: 'passageway/edit', component: PassagewayEditComponent},
    { path: 'passageway/list', component: PassagewayListComponent },
    { path: 'room/create', component: RoomCreateComponent },
    { path: 'map/load', component: MapLoadComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CampusRoutingModule { }
