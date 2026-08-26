import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTagEdit } from './dashboard-tag-edit';

describe('DashboardTagEdit', () => {
    let component: DashboardTagEdit;
    let fixture: ComponentFixture<DashboardTagEdit>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardTagEdit],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardTagEdit);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
