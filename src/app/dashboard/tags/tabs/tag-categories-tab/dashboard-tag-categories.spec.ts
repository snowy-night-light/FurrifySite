import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTagCategories } from './dashboard-tag-categories';

describe('DashboardTagsTabComponent', () => {
    let component: DashboardTagCategories;
    let fixture: ComponentFixture<DashboardTagCategories>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardTagCategories],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardTagCategories);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
