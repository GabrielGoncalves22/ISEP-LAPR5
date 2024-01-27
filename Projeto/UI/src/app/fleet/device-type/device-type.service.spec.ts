import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { DeviceTypeService } from './device-type.service';

describe('DeviceTypeService', () => {
    let service: DeviceTypeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        });
        service = TestBed.inject(DeviceTypeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
