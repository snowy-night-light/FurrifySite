import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTagAliases } from './dashboard-tag-aliases';

describe('DashboardTagsTabComponent', () => {
    let component: DashboardTagAliases;
    let fixture: ComponentFixture<DashboardTagAliases>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardTagAliases],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardTagAliases);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
