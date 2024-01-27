import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FloorEditComponent } from './floor-edit.component';

describe('FloorEditComponent', () => {
  let component: FloorEditComponent;
  let fixture: ComponentFixture<FloorEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FloorEditComponent],
      imports: [FormsModule, HttpClientModule]
    });
    fixture = TestBed.createComponent(FloorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
