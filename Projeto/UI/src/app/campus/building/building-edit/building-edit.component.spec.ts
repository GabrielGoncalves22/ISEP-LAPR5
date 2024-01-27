import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../../../environments/environment';
import { BuildingEditComponent } from './building-edit.component';
import { BuildingService } from '../building.service';

describe('BuildingEditComponent', () => {
    let component: BuildingEditComponent;
    let fixture: ComponentFixture<BuildingEditComponent>;

    let buildingBaseURL = environment.apiBaseUrl + '/buildings/';

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BuildingEditComponent],
            imports: [FormsModule, HttpClientModule, HttpClientTestingModule],
            providers: [BuildingService]
        });
        fixture = TestBed.createComponent(BuildingEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should edit a building', inject([HttpTestingController], (httpMock: HttpTestingController) => {
        const buildingData = {
            name: 'Edifíco I',
            description: 'Edifício de informática',
            numXCells: 10,
            numYCells: 5,
        };

        component.building = buildingData;
        component.selectedBuildingCode = 'I';
        component.editBuilding();

        const mockReq = httpMock.expectOne(buildingBaseURL + component.selectedBuildingCode);

        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.method).toBe('PUT');
        expect(mockReq.request.body).toEqual(buildingData);
    }));
});
