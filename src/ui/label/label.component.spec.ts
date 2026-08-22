import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelComponent } from './label.component';

describe('LabelComponent', () => {
    let component: LabelComponent;
    let fixture: ComponentFixture<LabelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LabelComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LabelComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('text', 'Test Label');
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
