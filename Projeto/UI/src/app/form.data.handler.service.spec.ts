import { TestBed } from '@angular/core/testing';

import { FormDataHandlerService } from './form.data.handler.service';

describe('FormDataHandlerService', () => {
  let service: FormDataHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormDataHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
