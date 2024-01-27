import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserActivateComponent } from './user-activate/user-activate.component';

const routes: Routes = [
    { path: 'create', component: UserCreateComponent },
    { path: 'activate', component: UserActivateComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UserRoutingModule { }
