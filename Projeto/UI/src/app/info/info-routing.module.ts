import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RgpdComponent } from './rgpd/rgpd.component';

const routes: Routes = [
    { path: 'rgpd', component: RgpdComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class InfoRoutingModule { }
