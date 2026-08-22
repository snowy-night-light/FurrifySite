import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';

import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { LibraryV1RestControllerService } from '../../openapi/generated/storage';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                provideHttpClient(),
                provideTranslateService(), 
                provideRouter([]),
                { provide: LibraryV1RestControllerService, useValue: { getAllPaged: () => of({ content: [], page: { totalElements: 0, totalPages: 0, number: 0, size: 0 } }) } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
