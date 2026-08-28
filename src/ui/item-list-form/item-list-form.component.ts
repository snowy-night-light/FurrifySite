import {Component, input, model, signal} from '@angular/core';
import {InputFieldComponent} from '../input-field/input-field.component';
import {LabelComponent} from '../label/label.component';
import {form, FormField, validate} from '@angular/forms/signals';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'ui-item-list-form',
    imports: [
        InputFieldComponent,
        LabelComponent,
        FormField,
        FormsModule
    ],
    templateUrl: './item-list-form.component.html',
    styleUrl: './item-list-form.component.css',
})
export class ItemListFormComponent {
    title = input<string>('');
    placeholder = input<string>('');
    emptyText = input<string>('');
    items = model<string[]>([]);

    itemValidators = input<((value: string) => { message: string } | null)[]>([]);

    inputModel = signal({ newItem: '' });
    inputForm = form(this.inputModel, (schemaPath) => {
        validate(schemaPath.newItem, () => {
            const valStr = this.inputModel().newItem || '';
            const validators = this.itemValidators();
            
            for (const validator of validators) {
                const error = validator(valStr);
                if (error) {
                    return { ...error, kind: 'error' };
                }
            }
            return null;
        });
    });

    addItem() {
        this.inputForm().markAsTouched();

        if (!this.inputForm().valid()) {
            return;
        }

        const value = this.inputModel().newItem;
        if (!value || !value.trim()) return;

        if (!this.items().includes(value.trim())) {
            this.items.update(list => [...list, value.trim()]);
        }

        this.inputModel.update(m => ({ ...m, newItem: '' }));
    }

    removeItem(index: number) {
        this.items.update(list => list.filter((_, i) => i !== index));
    }
}
