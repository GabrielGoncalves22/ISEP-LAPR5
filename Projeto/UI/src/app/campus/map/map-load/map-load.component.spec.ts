import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLoadComponent } from './map-load.component';
import { MapService } from '../map.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MapLoadComponent', () => {
  let component: MapLoadComponent;
  let fixture: ComponentFixture<MapLoadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapLoadComponent],
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule],
      providers: [MapService]
    });
    fixture = TestBed.createComponent(MapLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
