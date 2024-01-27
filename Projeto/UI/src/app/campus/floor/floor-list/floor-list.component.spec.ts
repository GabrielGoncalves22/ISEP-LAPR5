import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FloorListComponent } from './floor-list.component';

describe('FloorListComponent', () => {
    let component: FloorListComponent;
    let fixture: ComponentFixture<FloorListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FloorListComponent],
            imports: [FormsModule, HttpClientModule]
        });
        fixture = TestBed.createComponent(FloorListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
