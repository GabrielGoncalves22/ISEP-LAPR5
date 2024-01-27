import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { InfoRoutingModule } from './info-routing.module';
import { RgpdComponent } from './rgpd/rgpd.component';

@NgModule({
    declarations: [
        RgpdComponent
    ],
    imports: [
        CommonModule,
        InfoRoutingModule,
        PdfViewerModule
    ]
})

export class InfoModule { }
