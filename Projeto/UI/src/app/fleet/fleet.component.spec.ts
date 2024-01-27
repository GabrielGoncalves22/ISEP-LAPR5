import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetComponent } from './fleet.component';

describe('FleetComponent', () => {
    let component: FleetComponent;
    let fixture: ComponentFixture<FleetComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FleetComponent]
        });
        fixture = TestBed.createComponent(FleetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
