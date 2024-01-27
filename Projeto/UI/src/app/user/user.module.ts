import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { UserRoutingModule } from './user-routing.module';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserActivateComponent } from './user-activate/user-activate.component';

@NgModule({
    declarations: [
        UserCreateComponent,
        UserActivateComponent,
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        HttpClientModule,
        FormsModule,
        NgxPaginationModule
    ]
})

export class UserModule { }
