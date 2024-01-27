import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { PassagewayService } from './passageway.service';

describe('PassagewayService', () => {
    let service: PassagewayService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        });
        service = TestBed.inject(PassagewayService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
