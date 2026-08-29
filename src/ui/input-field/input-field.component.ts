import {Component, computed, input, output, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {ValidationFeedbackComponent} from '../validation-feedback/validation-feedback.component';
import {UiFormControl} from '../core/abstract/ui-form-control.abstract';

export type InputFieldTypes =
    "text"
    | "password"
    | "email"
    | "number"
    | "date"
    | "datetime-local"
    | "week"
    | "month"
    | "tel"
    | "url"
    | "search"
    | "time"
    | "color"
    | "file";


export type InputFieldSizes =
    "xs" | "sm" | "md" | "lg" | "xl";

export type InputFieldColors =
    "default"
    | "neutral"
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "warning"
    | "danger"
    | "success"
    | "error"
    | "transparent";

@Component({
    selector: 'ui-input-field',
    imports: [
        NgClass,
        ValidationFeedbackComponent
    ],
    templateUrl: './input-field.component.html',
    styleUrl: './input-field.component.css',
    host: {class: 'block w-full'}
})
export class InputFieldComponent extends UiFormControl {
    id = computed(() => self.crypto.randomUUID())
    datasetId = computed(() => this.id() + '-dataset')
    hideValidation = signal(false);

    type = input.required<InputFieldTypes>();
    rounded = input<boolean>(false)
    bordered = input<boolean>(true);
    size = input<InputFieldSizes>('md');
    color = input<InputFieldColors>('default');
    placeholder = input<string>('');
    iconClass = input<string[]>([]);
    datalist = input<string[]>([]);
    autocomplete = input<boolean>(false);
    accept = input<string | undefined>(undefined);
    multiple = input<boolean>(false);

    focus = output<FocusEvent>();
    change = output<Event>();
}
