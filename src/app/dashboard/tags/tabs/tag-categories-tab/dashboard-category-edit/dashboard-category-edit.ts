import {Component, input, signal, OnInit} from '@angular/core';
import {ModalComponent} from '../../../../../../ui/core/interface/modal-component.interface';
import {TagCategoryDTO} from '../../../../../../openapi/generated/storage';
import {InputFieldComponent} from '../../../../../../ui/input-field/input-field.component';
import {LabelComponent} from '../../../../../../ui/label/label.component';
import {form, FormField, required, pattern} from '@angular/forms/signals';
import {TranslatePipe} from '@ngx-translate/core';

export interface EditCategoryFormModel {
    name: string;
    hexColor: string;
}

@Component({
    selector: 'app-dashboard-category-edit',
    imports: [
        InputFieldComponent,
        LabelComponent,
        FormField,
        TranslatePipe
    ],
    templateUrl: './dashboard-category-edit.html',
    styleUrl: './dashboard-category-edit.css',
})
export class DashboardCategoryEdit implements ModalComponent<TagCategoryDTO>, OnInit {
    private readonly translatePipe = new TranslatePipe();

    data = input<{ data: TagCategoryDTO }>({data: {}});

    categoryModel = signal<EditCategoryFormModel>({
        name: '',
        hexColor: ''
    });

    categoryForm = form(this.categoryModel, (schemaPath) => {
        required(schemaPath.name, {message: this.translatePipe.transform('app.dashboard.tags.tabs.categories.editTagCategoryModal.errors.categoryNameIsRequired')});
        pattern(schemaPath.hexColor, new RegExp('^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$'), {message: this.translatePipe.transform('app.dashboard.tags.tabs.categories.editTagCategoryModal.errors.hexColorInvalidPattern')});
    });

    ngOnInit(): void {
        const inputData = this.data();

        if (inputData.data.name) {
            this.categoryModel.update(m => ({...m, name: inputData.data.name ?? ''}));
        }

        if (inputData.data.hexColor) {
            this.categoryModel.update(m => ({...m, hexColor: inputData.data.hexColor ?? ''}));
        }
    }


    onSaveReturnValue(): TagCategoryDTO {
        return {
            ...this.data().data,
            name: this.categoryModel().name,
            hexColor: this.categoryModel().hexColor
        };
    }

    get isValid(): boolean {
        return this.categoryForm().valid();
    }
}
