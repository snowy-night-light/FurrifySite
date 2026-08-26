import {Component, input, OnInit, computed, signal, effect, untracked, ViewChild, viewChild} from '@angular/core';
import {UiFormControl} from '../core/abstract/ui-form-control.abstract';
import {CrudDataSet} from '../../store/common/crud/crud-data-set';
import {BaseEntity} from '../../openapi/base/base-entity.interface';
import {CreateRequest} from '../../openapi/base/create-request.interface';
import {PatchRequest} from '../../openapi/base/patch-request.interface';
import {DynamicDropdownComponent, DynamicDropdownItem, DynamicDropdownSearchGroup} from '../dynamic-dropdown/dynamic-dropdown.component';
import {InputFieldComponent} from '../input-field/input-field.component';

import {ValidationFeedbackComponent} from '../validation-feedback/validation-feedback.component';

@Component({
    selector: 'ui-dynamic-multi-select-dropdown',
    imports: [
        DynamicDropdownComponent,
        InputFieldComponent,
        ValidationFeedbackComponent
    ],
    templateUrl: './dynamic-multi-select-dropdown.component.html',
    host: { class: 'block w-full' }
})
export class DynamicMultiSelectDropdownComponent<DTO extends BaseEntity, CREATE_REQ extends CreateRequest, PATCH_REQ extends PatchRequest, ITEM_VALUE> extends UiFormControl<ITEM_VALUE[]> implements OnInit {
    dataset = input.required<CrudDataSet<DTO, CREATE_REQ, PATCH_REQ>>();
    searchGroup = input.required<DynamicDropdownSearchGroup[]>();
    mapDisplayItem = input.required<(dto: DTO) => DynamicDropdownItem<ITEM_VALUE>>();

    initialDisplayItems = input<DynamicDropdownItem<ITEM_VALUE>[]>([]);

    placeholder = input<string>('');

    selectedItems = signal<DynamicDropdownItem<ITEM_VALUE>[]>([]);

    dropdownInput = viewChild.required<InputFieldComponent>('dropdownInput');

    constructor() {
        super();

        effect(() => {
            const initial = this.initialDisplayItems();
            untracked(() => {
                if (initial && initial.length > 0) {
                    this.selectedItems.set(initial);
                }
            });
        });
    }

    ngOnInit() {
        if (!this.value()) {
            this.value.set([]);
        }
    }

    onItemSelected(itemValue: ITEM_VALUE, dropdownItems: DTO[]) {
        const dto = dropdownItems.find(d => this.mapDisplayItem()(d).value === itemValue);
        if (!dto) return;

        const displayItem = this.mapDisplayItem()(dto);
        const currentVals = this.value() || [];

        if (!currentVals.includes(itemValue)) {
            this.value.set([...currentVals, itemValue]);
            this.onChange(this.value());
            this.selectedItems.update(items => [...items, displayItem]);
        }

        if (this.dropdownInput()) {
            this.dropdownInput().value.set('');
        }
    }

    removeItem(itemValue: ITEM_VALUE) {
        const currentVals = this.value() || [];
        this.value.set(currentVals.filter(v => v !== itemValue));
        this.onChange(this.value());
        this.selectedItems.update(items => items.filter(i => i.value !== itemValue));
    }
}
