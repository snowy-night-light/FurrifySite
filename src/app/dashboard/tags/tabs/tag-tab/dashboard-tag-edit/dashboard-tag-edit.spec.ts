import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTagEdit } from './dashboard-tag-edit';

import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DashboardTagEdit', () => {
    let component: DashboardTagEdit;
    let fixture: ComponentFixture<DashboardTagEdit>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardTagEdit],
            providers: [provideTranslateService(), provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardTagEdit);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
