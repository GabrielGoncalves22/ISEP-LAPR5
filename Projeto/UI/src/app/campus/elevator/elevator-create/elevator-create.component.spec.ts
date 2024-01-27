import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../../../environments/environment';
import { ElevatorCreateComponent } from './elevator-create.component';
import { ElevatorService } from '../elevator.service';

describe('ElevatorCreateComponent', () => {
    let component: ElevatorCreateComponent;
    let fixture: ComponentFixture<ElevatorCreateComponent>;

    let elevatorBaseURL = environment.apiBaseUrl + '/buildings/elevators';

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ElevatorCreateComponent],
            imports: [FormsModule, HttpClientModule, HttpClientTestingModule],
            providers: [ElevatorService]
        });
        fixture = TestBed.createComponent(ElevatorCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create a elevator', inject([HttpTestingController], (httpMock: HttpTestingController) => {
        const elevatorData = {
            brand: 'Schindler',
            model: 'Thyssenkrupp',
            serialNumber: '6007041A2',
            description: 'Elevator para servir o edifício I',
            building: 'I',
            floors: [
                { number: 1 },
                { number: 2 },
                { number: 3 },
            ]
        };

        component.elevator = elevatorData;
        component.createElevator();

        const mockReq = httpMock.expectOne(elevatorBaseURL);

        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.method).toBe('POST');
    }));
});
