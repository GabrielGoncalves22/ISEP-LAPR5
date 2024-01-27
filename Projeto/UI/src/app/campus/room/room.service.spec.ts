import { TestBed } from '@angular/core/testing';

import { RoomService } from './room.service';
import { HttpClientModule } from '@angular/common/http';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(RoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
