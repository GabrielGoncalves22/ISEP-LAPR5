import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../../../environments/environment';
import { DeviceTypeCreateComponent } from './device-type-create.component';
import { DeviceTypeService } from '../device-type.service';

describe('DeviceTypeCreateComponent', () => {
    let component: DeviceTypeCreateComponent;
    let fixture: ComponentFixture<DeviceTypeCreateComponent>;

    const deviceTypeBaseURL = environment.apiBaseUrl + '/devices/types';

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DeviceTypeCreateComponent],
            imports: [FormsModule, HttpClientModule, HttpClientTestingModule],
            providers: [DeviceTypeService]
        });
        fixture = TestBed.createComponent(DeviceTypeCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create a device type', inject([HttpTestingController], (httpMock: HttpTestingController) => {
        const deviceTypeData = { type: 'Robot', brand: 'Xiamoi', model: 'Vaccuum', taskTypes: [0] };

        component.deviceType = deviceTypeData;
        component.createDeviceType();

        const mockReq = httpMock.expectOne(deviceTypeBaseURL);

        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.method).toBe('POST');
    }));
});
