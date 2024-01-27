import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BuildingCreateComponent } from './building-create.component';

describe('BuildingCreateComponent', () => {
    let component: BuildingCreateComponent;
    let fixture: ComponentFixture<BuildingCreateComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BuildingCreateComponent],
            imports: [FormsModule, HttpClientModule]
        });
        fixture = TestBed.createComponent(BuildingCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
