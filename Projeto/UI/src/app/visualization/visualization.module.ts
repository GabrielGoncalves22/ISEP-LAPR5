import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';

import { VisualizationRoutingModule } from './visualization-routing.module';
import { FloorVisualizationComponent } from './floor-visualization/floor-visualization.component';
import { PathAnimationComponent } from './path-animation/path-animation.component';

@NgModule({
    declarations: [
        FloorVisualizationComponent,
        PathAnimationComponent
    ],
    imports: [
        CommonModule,
        VisualizationRoutingModule,
        HttpClientModule,
        FormsModule
    ]
})

export class VisualizationModule { }
