import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BuildingListComponent } from './building-list.component';

describe('BuildingListComponent', () => {
    let component: BuildingListComponent;
    let fixture: ComponentFixture<BuildingListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BuildingListComponent],
            imports: [FormsModule, HttpClientModule]
        });
        fixture = TestBed.createComponent(BuildingListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
