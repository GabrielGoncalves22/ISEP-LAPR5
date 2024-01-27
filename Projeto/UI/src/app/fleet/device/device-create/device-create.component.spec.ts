import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCreateComponent } from './device-create.component';

describe('DeviceCreateComponent', () => {
  let component: DeviceCreateComponent;
  let fixture: ComponentFixture<DeviceCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceCreateComponent]
    });
    fixture = TestBed.createComponent(DeviceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
