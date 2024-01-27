import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PassagewayListComponent } from './passageway-list.component';

describe('PassagewayListComponent', () => {
    let component: PassagewayListComponent;
    let fixture: ComponentFixture<PassagewayListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PassagewayListComponent],
            imports: [FormsModule, HttpClientModule],
        });
        fixture = TestBed.createComponent(PassagewayListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
