import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTagsTabComponent } from './dashboard-tags-tab.component';

import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('DashboardTagsTabComponent', () => {
    let component: DashboardTagsTabComponent;
    let fixture: ComponentFixture<DashboardTagsTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardTagsTabComponent],
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

        fixture = TestBed.createComponent(DashboardTagsTabComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
