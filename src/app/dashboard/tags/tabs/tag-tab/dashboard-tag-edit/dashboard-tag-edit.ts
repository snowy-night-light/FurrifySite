import {Component, inject, input, signal, OnInit} from '@angular/core';
import {ModalComponent} from '../../../../../../ui/core/interface/modal-component.interface';
import {
    LibraryDTO,
    LibraryV1RestControllerService, TagAliasDTO, TagAliasV1RestControllerService,
    TagCategoryDTO,
    TagCategoryV1RestControllerService,
    TagDTO
} from '../../../../../../openapi/generated/storage';
import {InputFieldComponent} from '../../../../../../ui/input-field/input-field.component';
import {LabelComponent} from '../../../../../../ui/label/label.component';
import {
    DynamicDropdownComponent,
    DynamicDropdownItem
} from '../../../../../../ui/dynamic-dropdown/dynamic-dropdown.component';
import {CrudDataSet} from '../../../../../../store/common/crud/crud-data-set';
import {CrudDataSource} from '../../../../../../store/common/crud/crud-data-source';
import {disabled, form, FormField, required, validate, SchemaPath, pattern} from '@angular/forms/signals';
import {dependsOnField} from '../../../../../../ui/core/validator/depends-on-field.validator';
import {TranslatePipe} from '@ngx-translate/core';

export interface EditTagFormModel {
    name: string;
    categoryName: string;
    categoryId: string;
    libraryName: string;
    libraryId: string;
}

@Component({
    selector: 'app-dashboard-tag-edit',
    imports: [
        InputFieldComponent,
        LabelComponent,
        DynamicDropdownComponent,
        FormField,
        TranslatePipe
    ],
    templateUrl: './dashboard-tag-edit.html',
    styleUrl: './dashboard-tag-edit.css',
})
export class DashboardTagEdit implements ModalComponent<TagDTO>, OnInit {
    private readonly tagCategoriesService = inject(TagCategoryV1RestControllerService);
    private readonly libraryService = inject(LibraryV1RestControllerService);
    private readonly tagAliasService = inject(TagAliasV1RestControllerService);

    private readonly translatePipe = new TranslatePipe();

    data = input<{ data: TagDTO }>({data: {}});

    tagModel = signal<EditTagFormModel>({
        name: '',
        categoryName: '',
        categoryId: '',
        libraryName: '',
        libraryId: ''
    });

    aliases = signal<TagAliasDTO[]>([]);
    aliasDataset = new CrudDataSet(new CrudDataSource(this.tagAliasService));
    removingAliasId = signal<string | null>(null);

    createAlias() {
        // TODO: Implement create alias logic
    }

    removeAlias(aliasId: string) {
        this.removingAliasId.set(aliasId);
        this.aliasDataset.deleteById(aliasId).subscribe({
            next: () => {
                this.removingAliasId.set(null);
                this.aliases.update(aliases => aliases.filter(a => a.id !== aliasId));
            },
            error: () => {
                this.removingAliasId.set(null);
            }
        });
    }

    tagForm = form(this.tagModel, (schemaPath) => {
        required(schemaPath.name, {message: this.translatePipe.transform('app.dashboard.tags.tabs.tags.editTagModal.errors.nameRequired') });
        pattern(schemaPath.name, new RegExp('^[a-z0-9]+(?: [a-z0-9]+)*$'), {message: this.translatePipe.transform('app.dashboard.tags.tabs.tags.editTagModal.errors.invalidPattern')}),

        dependsOnField(schemaPath.categoryName, schemaPath.categoryId, {message: this.translatePipe.transform('app.dashboard.tags.tabs.tags.editTagModal.errors.selectCategoryFromDropdown')});
        required(schemaPath.categoryName, {message: this.translatePipe.transform('app.dashboard.tags.tabs.tags.editTagModal.errors.categoryRequired')});

        required(schemaPath.libraryName, {message: this.translatePipe.transform('app.dashboard.tags.tabs.tags.editTagModal.errors.libraryRequired')});
        dependsOnField(schemaPath.libraryName, schemaPath.libraryId, {message: this.translatePipe.transform('app.dashboard.tags.tabs.tags.editTagModal.errors.selectLibraryFromDropdown')});

        disabled(schemaPath.libraryName, { when: () => !!this.data().data?.library?.id });
    });

    categoryDataset = new CrudDataSet(new CrudDataSource(this.tagCategoriesService));
    libraryDataset = new CrudDataSet(new CrudDataSource(this.libraryService));

    ngOnInit() {
        const inputData = this.data();
        if (inputData?.data) {
            this.tagModel.set({
                name: inputData.data.name || '',
                categoryName: inputData.data.category?.name ?? (inputData.data.category?.id ? 'Tag category id ' + inputData.data.category.id : ''),
                categoryId: inputData.data.category?.id || '',
                libraryName: inputData.data.library?.title ?? (inputData.data.library?.id ? 'Library id ' + inputData.data.library.id : ''),
                libraryId: inputData.data.library?.id || ''
            });

            this.aliases.set(inputData.data.aliases || []);

            if (inputData.data.library?.id && !inputData.data.library.title) {
                this.libraryService.getById(inputData.data.library.id).subscribe(library => {
                    if (library.title) {
                        this.tagModel.update(m => ({ ...m, libraryName: library.title! }));
                    }
                });
            }
        }
    }

    protected mapLibraryToDisplayItem = (dto: LibraryDTO): DynamicDropdownItem<LibraryDTO> => {
        return {
            text: dto.title ?? 'Library id ' + dto.id,
            value: dto
        };
    }

    updateLibrary(library: LibraryDTO) {
        this.tagModel.update(m => ({ ...m, libraryName: library.title ?? 'Library id ' + library.id, libraryId: library.id || '' }));
    }

    clearLibrary() {
        this.tagModel.update(m => ({ ...m, libraryId: '' }));
    }

    protected mapTagCategoryToDisplayItem = (dto: TagCategoryDTO): DynamicDropdownItem<TagCategoryDTO> => {
        return {
            text: dto.name ?? 'Tag category id ' + dto.id,
            value: dto,
            colorHex: dto.hexColor
        };
    }

    updateCategory(category: TagCategoryDTO) {
        this.tagModel.update(m => ({ ...m, categoryName: category.name ?? 'Tag category id ' + category.id, categoryId: category.id || '' }));
    }

    clearCategory() {
        this.tagModel.update(m => ({ ...m, categoryId: '' }));
    }

    get isValid(): boolean {
        return this.tagForm().valid();
    }

    onSaveReturnValue(): TagDTO {
        return {
            ...this.data().data,
            name: this.tagModel().name,
            category: this.tagModel().categoryId ? { id: this.tagModel().categoryId } : undefined,
            library: this.tagModel().libraryId ? { id: this.tagModel().libraryId } : undefined
        } as TagDTO;
    }
}
