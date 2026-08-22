import {Component, input} from '@angular/core';
import {NgClass} from '@angular/common';

export type LabelType = 'float' | 'static';

@Component({
    selector: 'ui-label',
    imports: [
        NgClass
    ],
    templateUrl: './label.component.html',
    styleUrl: './label.component.css',
    host: { class: 'block w-full' }
})
export class LabelComponent {
    text = input.required<string>();
    type = input<LabelType>('static');
}
