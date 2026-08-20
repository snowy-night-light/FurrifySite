import {Component, computed, input, forwardRef} from '@angular/core';
import {NgClass} from '@angular/common';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
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
    | "time";


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

    type = input.required<InputFieldTypes>();
    size = input<InputFieldSizes>('md');
    color = input<InputFieldColors>('default');
    placeholder = input<string>();
    iconClass = input<string[]>([]);
    datalist = input<string[]>([]);
    autocomplete = input<boolean>(false)
}
