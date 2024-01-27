import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FloorVisualizationComponent } from './floor-visualization/floor-visualization.component';
import { PathAnimationComponent } from './path-animation/path-animation.component';

const routes: Routes = [
    { path: 'interactive', component: FloorVisualizationComponent },
    { path: 'animation', component: PathAnimationComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class VisualizationRoutingModule { }
