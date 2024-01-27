import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from 'ngx-pagination';

import { TaskRoutingModule } from './task-routing.module';
import { PathListComponent } from './path/path-list/path-list.component';
import { TaskCreateSurveillanceComponent } from './task-create/task-create-surveillance/task-create-surveillance.component';
import { TaskCreatePickupAndDeliveryComponent } from './task-create/task-create-pickup-and-delivery/task-create-pickup-and-delivery.component';
import { TaskApproveComponent } from './task-approve/task-approve.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskExecComponent } from './task-exec/task-exec.component';

@NgModule({
    declarations: [
        TaskCreateSurveillanceComponent,
        TaskCreatePickupAndDeliveryComponent,
        PathListComponent,
        TaskApproveComponent,
        TaskListComponent,
        TaskExecComponent,
    ],
    imports: [
        CommonModule,
        TaskRoutingModule,
        HttpClientModule,
        FormsModule,
        NgxPaginationModule
    ]
})

export class TaskModule { }
