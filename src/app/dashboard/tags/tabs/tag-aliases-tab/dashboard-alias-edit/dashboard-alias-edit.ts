import {Component, inject, input, signal, OnInit} from '@angular/core';
import {ModalComponent} from '../../../../../../ui/core/interface/modal-component.interface';
import {
    TagAliasDTO,
    TagDTO,
    TagV1RestControllerService
} from '../../../../../../openapi/generated/storage';
import {InputFieldComponent} from '../../../../../../ui/input-field/input-field.component';
import {LabelComponent} from '../../../../../../ui/label/label.component';
import {
    DynamicDropdownComponent,
    DynamicDropdownItem
} from '../../../../../../ui/dynamic-dropdown/dynamic-dropdown.component';
import {CrudDataSet} from '../../../../../../store/common/crud/crud-data-set';
import {CrudDataSource} from '../../../../../../store/common/crud/crud-data-source';
import {form, FormField, required, pattern, disabled} from '@angular/forms/signals';
import {dependsOnField} from '../../../../../../ui/core/validator/depends-on-field.validator';
import {TranslatePipe} from '@ngx-translate/core';

export interface EditAliasFormModel {
    alias: string;
    targetTagName: string;
    targetTagId: string;
}

@Component({
    selector: 'app-dashboard-alias-edit',
    imports: [
        InputFieldComponent,
        LabelComponent,
        DynamicDropdownComponent,
        FormField,
        TranslatePipe
    ],
    templateUrl: './dashboard-alias-edit.html',
    styleUrl: './dashboard-alias-edit.css',
})
export class DashboardAliasEdit implements ModalComponent<TagAliasDTO>, OnInit {
    private readonly tagsService = inject(TagV1RestControllerService);
    private readonly translatePipe = new TranslatePipe();

    data = input<{ data: TagAliasDTO }>({data: {}});

    aliasModel = signal<EditAliasFormModel>({
        alias: '',
        targetTagName: '',
        targetTagId: ''
    });

    aliasForm = form(this.aliasModel, (schemaPath) => {
        required(schemaPath.alias, {message: this.translatePipe.transform('app.dashboard.tags.tabs.aliases.editTagAliasModal.errors.aliasIsRequired') });
        pattern(schemaPath.alias, new RegExp('^[a-z0-9]+(?: [a-z0-9]+)*$'), {message: this.translatePipe.transform('app.dashboard.tags.tabs.aliases.editTagAliasModal.errors.invalidPattern')});

        dependsOnField(schemaPath.targetTagName, schemaPath.targetTagId, {message: this.translatePipe.transform('app.dashboard.tags.tabs.aliases.editTagAliasModal.errors.selectTargetTagFromDropdown')});
        required(schemaPath.targetTagName, {message: this.translatePipe.transform('app.dashboard.tags.tabs.aliases.editTagAliasModal.errors.targetTagIsRequired')});

        disabled(schemaPath.targetTagName, { when: () => !this.data().data?.id && !!this.data().data?.targetTag?.id });
    });

    tagDataset = new CrudDataSet(new CrudDataSource(this.tagsService));

    ngOnInit() {
        const inputData = this.data();
        if (inputData?.data) {
            this.aliasModel.set({
                alias: inputData.data.alias || '',
                targetTagName: inputData.data.targetTag?.name ?? (inputData.data.targetTag?.id ? 'Tag id ' + inputData.data.targetTag.id : ''),
                targetTagId: inputData.data.targetTag?.id || ''
            });

            if (inputData.data.targetTag?.id && !inputData.data.targetTag.name) {
                this.tagsService.getById(inputData.data.targetTag.id).subscribe(tag => {
                    if (tag.name) {
                        this.aliasModel.update(m => ({ ...m, targetTagName: tag.name! }));
                    }
                });
            }
        }
    }

    protected mapTagToDisplayItem = (dto: TagDTO): DynamicDropdownItem<TagDTO> => {
        return {
            text: dto.name ?? 'Tag id ' + dto.id,
            value: dto,
            colorHex: dto.category?.hexColor
        };
    }

    updateTag(tag: TagDTO) {
        this.aliasModel.update(m => ({ ...m, targetTagName: tag.name ?? 'Tag id ' + tag.id, targetTagId: tag.id || '' }));
    }

    clearTag() {
        this.aliasModel.update(m => ({ ...m, targetTagId: '' }));
    }

    get isValid(): boolean {
        return this.aliasForm().valid();
    }

    onSaveReturnValue(): TagAliasDTO {
        return {
            ...this.data().data,
            alias: this.aliasModel().alias,
            targetTag: this.aliasModel().targetTagId ? { id: this.aliasModel().targetTagId } : undefined
        };
    }
}
