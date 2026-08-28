import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardArtistEditComponent } from './dashboard-artist-edit.component';
import { provideTranslateService } from '@ngx-translate/core';

describe('DashboardArtistEdit', () => {
    let component: DashboardArtistEditComponent;
    let fixture: ComponentFixture<DashboardArtistEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardArtistEditComponent],
            providers: [provideTranslateService()]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardArtistEditComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
