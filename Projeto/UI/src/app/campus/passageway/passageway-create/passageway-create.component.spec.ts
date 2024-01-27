import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PassagewayCreateComponent } from './passageway-create.component';

describe('PassagewayCreateComponent', () => {
    let component: PassagewayCreateComponent;
    let fixture: ComponentFixture<PassagewayCreateComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PassagewayCreateComponent],
            imports: [FormsModule, HttpClientModule],
        });
        fixture = TestBed.createComponent(PassagewayCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
