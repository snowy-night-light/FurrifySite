import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTagCategories } from './dashboard-tag-categories';

import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('DashboardTagsTabComponent', () => {
    let component: DashboardTagCategories;
    let fixture: ComponentFixture<DashboardTagCategories>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardTagCategories],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideTranslateService(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        parent: { paramMap: of(convertToParamMap({ libraryId: '123' })) },
                        queryParamMap: of(convertToParamMap({})),
                        snapshot: { queryParamMap: convertToParamMap({}) }
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardTagCategories);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
