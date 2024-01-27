import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathListComponent } from "./path/path-list/path-list.component";
import { TaskCreateSurveillanceComponent } from './task-create/task-create-surveillance/task-create-surveillance.component';
import { TaskCreatePickupAndDeliveryComponent } from './task-create/task-create-pickup-and-delivery/task-create-pickup-and-delivery.component';
import { TaskApproveComponent } from './task-approve/task-approve.component';
import { TaskListComponent } from './task-list/task-list.component';
import { VerifyAuthService } from '../verify-auth.service';
import { Role } from '../user/models/role';
import { TaskExecComponent } from './task-exec/task-exec.component';

const routes: Routes = [
    { path: 'path', component: PathListComponent, canActivate: [VerifyAuthService], data: { roles: [Role.TaskManager] } },
    { path: 'create/task-surveillance', component: TaskCreateSurveillanceComponent, canActivate: [VerifyAuthService], data: { roles: [Role.User] } },
    { path: 'create/task-pickup-and-delivery', component: TaskCreatePickupAndDeliveryComponent, canActivate: [VerifyAuthService], data: { roles: [Role.User] } },
    { path: 'approve', component: TaskApproveComponent, canActivate: [VerifyAuthService], data: { roles: [Role.TaskManager] } },
    { path: 'list', component: TaskListComponent, canActivate: [VerifyAuthService], data: { roles: [Role.TaskManager] } },
    { path: 'exec', component: TaskExecComponent, canActivate: [VerifyAuthService], data: { roles: [Role.TaskManager] } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TaskRoutingModule { }
