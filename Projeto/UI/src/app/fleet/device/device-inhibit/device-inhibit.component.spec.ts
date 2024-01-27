import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DeviceInhibitComponent } from './device-inhibit.component';

describe('DeviceInhibitComponent', () => {
    let component: DeviceInhibitComponent;
    let fixture: ComponentFixture<DeviceInhibitComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DeviceInhibitComponent],
            imports: [FormsModule, HttpClientModule]
        });
        fixture = TestBed.createComponent(DeviceInhibitComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
