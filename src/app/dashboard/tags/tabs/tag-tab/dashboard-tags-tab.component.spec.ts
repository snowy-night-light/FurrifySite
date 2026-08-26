import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTagsTabComponent } from './dashboard-tags-tab.component';

describe('DashboardTagsTabComponent', () => {
    let component: DashboardTagsTabComponent;
    let fixture: ComponentFixture<DashboardTagsTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardTagsTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardTagsTabComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
