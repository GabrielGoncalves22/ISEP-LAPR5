import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorVisualizationComponent } from './floor-visualization.component';

describe('FloorVisualizationComponent', () => {
  let component: FloorVisualizationComponent;
  let fixture: ComponentFixture<FloorVisualizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FloorVisualizationComponent]
    });
    fixture = TestBed.createComponent(FloorVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
