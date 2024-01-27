import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCreateComponent } from './room-create.component';
import { RoomService } from '../room.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RoomCreateComponent', () => {
  let component: RoomCreateComponent;
  let fixture: ComponentFixture<RoomCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomCreateComponent],
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule],
      providers: [RoomService]
    });
    fixture = TestBed.createComponent(RoomCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
