import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ElevatorService } from './elevator.service';

describe('ElevatorService', () => {
    let service: ElevatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        });
        service = TestBed.inject(ElevatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
