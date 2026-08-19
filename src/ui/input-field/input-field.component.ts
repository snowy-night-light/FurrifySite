import {Component, computed, input} from '@angular/core';
import {NgClass} from '@angular/common';

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
    "neutral" | "primary" | "secondary" | "accent" | "info" | "warning" | "danger" | "success" | "error" | "transparent";

@Component({
    selector: 'ui-input-field',
    imports: [
        NgClass
    ],
    templateUrl: './input-field.component.html',
    styleUrl: './input-field.component.css',
})
export class InputFieldComponent {
    id = computed(() => self.crypto.randomUUID())
    datasetId = computed(() => this.id() + '-dataset')

    name = input('');
    type = input.required<InputFieldTypes>();
    size = input<InputFieldSizes>('md');
    color = input<InputFieldColors>('neutral');
    placeholder = input<string>();
    iconClass = input<string[]>([]);
    datalist = input<string[]>([]);
    autocomplete = input<boolean>(false)
    disabled = input<boolean>(false);
}
