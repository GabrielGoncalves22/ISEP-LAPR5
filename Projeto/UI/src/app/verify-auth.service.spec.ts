import { TestBed } from '@angular/core/testing';

import { VerifyAuthService } from './verify-auth.service';

describe('VerifyAuthService', () => {
    let service: VerifyAuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VerifyAuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
