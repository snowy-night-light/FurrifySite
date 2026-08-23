import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTagsComponent } from './dashboard-tags.component';

describe('TagsComponent', () => {
    let component: DashboardTagsComponent;
    let fixture: ComponentFixture<DashboardTagsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardTagsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardTagsComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
