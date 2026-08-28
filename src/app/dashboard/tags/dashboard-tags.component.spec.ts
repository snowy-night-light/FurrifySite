import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTagsComponent } from './dashboard-tags.component';

import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';

describe('TagsComponent', () => {
    let component: DashboardTagsComponent;
    let fixture: ComponentFixture<DashboardTagsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardTagsComponent],
            providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), provideTranslateService()]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardTagsComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
