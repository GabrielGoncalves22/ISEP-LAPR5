import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { BuildingService } from './building.service';

describe('BuildingService', () => {
    let service: BuildingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        });
        service = TestBed.inject(BuildingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
