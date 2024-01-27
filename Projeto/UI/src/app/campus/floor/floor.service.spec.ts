import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { FloorService } from './floor.service';

describe('FloorService', () => {
    let service: FloorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        });
        service = TestBed.inject(FloorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
