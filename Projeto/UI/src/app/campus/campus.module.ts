import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';

import { CampusRoutingModule } from './campus-routing.module';
import { CampusComponent } from './campus.component';
import { BuildingCreateComponent } from './building/building-create/building-create.component';
import { BuildingEditComponent } from './building/building-edit/building-edit.component';
import { BuildingListComponent } from './building/building-list/building-list.component';
import { FloorCreateComponent } from './floor/floor-create/floor-create.component';
import { PassagewayCreateComponent } from './passageway/passageway-create/passageway-create.component';
import { FloorListComponent } from './floor/floor-list/floor-list.component';
import { ElevatorCreateComponent } from './elevator/elevator-create/elevator-create.component';
import { ElevatorListComponent } from './elevator/elevator-list/elevator-list.component';
import { PassagewayListComponent } from './passageway/passageway-list/passageway-list.component';
import { RoomCreateComponent } from './room/room-create/room-create.component';
import { MapLoadComponent } from './map/map-load/map-load.component';
import { FloorEditComponent } from './floor/floor-edit/floor-edit.component';
import { PassagewayEditComponent } from './passageway/passageway-edit/passageway-edit.component';
import { ElevatorEditComponent } from './elevator/elevator-edit/elevator-edit.component';


@NgModule({
    declarations: [
        CampusComponent,
        BuildingCreateComponent,
        BuildingEditComponent,
        FloorCreateComponent,
        PassagewayCreateComponent,
        BuildingListComponent,
        FloorCreateComponent,
        FloorListComponent,
        ElevatorCreateComponent,
        ElevatorListComponent,
        PassagewayListComponent,
        RoomCreateComponent,
        MapLoadComponent,
        FloorEditComponent,
        PassagewayEditComponent,
        ElevatorEditComponent
    ],
    imports: [
        CommonModule,
        CampusRoutingModule,
        HttpClientModule,
        FormsModule
    ]
})

export class CampusModule { }
