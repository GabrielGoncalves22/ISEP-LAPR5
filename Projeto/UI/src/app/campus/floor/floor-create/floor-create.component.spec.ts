import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../../../environments/environment';
import { FloorCreateComponent } from './floor-create.component';
import { FloorService } from '../floor.service';

describe('FloorCreateComponent', () => {
    let component: FloorCreateComponent;
    let fixture: ComponentFixture<FloorCreateComponent>;

    let floorBaseURL = environment.apiBaseUrl + '/buildings/floors';

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FloorCreateComponent],
            imports: [FormsModule, HttpClientModule, HttpClientTestingModule],
            providers: [FloorService]
        });
        fixture = TestBed.createComponent(FloorCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /*
    it('should create a floor', inject([HttpTestingController], (httpMock: HttpTestingController) => {
        const floorData = { number: 1, description: 'Piso de ferramentas', building: 'B' };

        component.floor = floorData;
        component.createFloor();

        const mockReq = httpMock.expectOne(floorBaseURL);

        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.method).toBe('POST');
    }));
    */
});
