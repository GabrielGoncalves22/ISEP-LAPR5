import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PassagewayEditComponent } from './passageway-edit.component';

describe('PassagewayEditComponent', () => {
  let component: PassagewayEditComponent;
  let fixture: ComponentFixture<PassagewayEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PassagewayEditComponent],
      imports: [FormsModule, HttpClientModule]
    });
    fixture = TestBed.createComponent(PassagewayEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
