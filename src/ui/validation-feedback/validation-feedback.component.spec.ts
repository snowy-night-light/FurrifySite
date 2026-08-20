import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationFeedbackComponent } from './validation-feedback.component';

describe('ValidationFeedback', () => {
    let component: ValidationFeedbackComponent;
    let fixture: ComponentFixture<ValidationFeedbackComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ValidationFeedbackComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ValidationFeedbackComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
