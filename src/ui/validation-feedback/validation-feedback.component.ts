import {Component, input} from '@angular/core';

@Component({
    selector: 'ui-validation-feedback',
    imports: [],
    templateUrl: './validation-feedback.component.html',
    styleUrl: './validation-feedback.component.css',
})
export class ValidationFeedbackComponent {
    feedback = input.required<string>();
}
