import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDropdownComponent } from './dynamic-dropdown.component';

describe('DynamicDropdown', () => {
    let component: DynamicDropdownComponent;
    let fixture: ComponentFixture<DynamicDropdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DynamicDropdownComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DynamicDropdownComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
