import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardArtistsComponent } from './dashboard-artists.component';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('Artists', () => {
    let component: DashboardArtistsComponent;
    let fixture: ComponentFixture<DashboardArtistsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardArtistsComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideTranslateService(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of(convertToParamMap({ libraryId: '123' })),
                        queryParamMap: of(convertToParamMap({})),
                        snapshot: { queryParamMap: convertToParamMap({}) }
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardArtistsComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
