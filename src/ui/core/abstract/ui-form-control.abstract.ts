import {Directive, inject, model, output, signal} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';

@Directive()
export abstract class UiFormControl implements ControlValueAccessor {
    ngControl = inject(NgControl, { optional: true, self: true });

    constructor() {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    protected validationFeedback = signal<string | undefined>(undefined);

    disabled = model<boolean>(false);
    value = model<string>('');
    invalid = signal<boolean>(false);

    blur = output<void>();

    onChange: (value: string) => void = () => {};
    onTouch: () => void = () => {};

    onInput(event: Event) {
        const val = (event.target as HTMLInputElement).value;
        this.value.set(val);
        this.onChange(val);
        this.updateFeedback();
    }

    onBlur() {
        this.onTouch();
        this.blur.emit();
        this.updateFeedback();
    }

    updateFeedback() {
        if (!this.ngControl || !this.ngControl.control) {
            return;
        }

        const errors = this.ngControl.control.errors;
        if (errors && this.ngControl.touched) {
            const firstErrorKey = Object.keys(errors)[0];
            const errorObj = errors[firstErrorKey];

            if (errorObj && typeof errorObj === 'object' && errorObj.message) {
                this.validationFeedback.set(errorObj.message);
            } else if (typeof errorObj === 'string') {
                this.validationFeedback.set(errorObj);
            } else {
                this.validationFeedback.set(undefined);
            }

            this.invalid.set(true);
        } else {
            this.validationFeedback.set(undefined);
            this.invalid.set(false);
        }
    }

    writeValue(value: string | null | undefined): void {
        this.value.set(value || '');
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

}
