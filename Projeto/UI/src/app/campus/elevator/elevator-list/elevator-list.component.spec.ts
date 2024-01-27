import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { ElevatorListComponent } from './elevator-list.component';
import { ElevatorService } from '../elevator.service';

describe('ElevatorListComponent', () => {
    let component: ElevatorListComponent;
    let fixture: ComponentFixture<ElevatorListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ElevatorListComponent],
            imports: [FormsModule, HttpClientModule],
            providers: [ElevatorService]
        });
        fixture = TestBed.createComponent(ElevatorListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
