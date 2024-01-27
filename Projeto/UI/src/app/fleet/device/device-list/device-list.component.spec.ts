import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DeviceListComponent } from './device-list.component';

describe('DeviceListComponent', () => {
    let component: DeviceListComponent;
    let fixture: ComponentFixture<DeviceListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DeviceListComponent],
            imports: [FormsModule, HttpClientModule]
        });
        fixture = TestBed.createComponent(DeviceListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
