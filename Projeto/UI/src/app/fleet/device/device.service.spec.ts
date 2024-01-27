import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { DeviceService } from './device.service';

describe('DeviceService', () => {
    let service: DeviceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        });
        service = TestBed.inject(DeviceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
