import {Component, inject, input, signal, computed, OnInit, viewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ModalDialogComponent} from '../../../../../../ui/modal-dialog/modal-dialog.component';
import {DashboardAliasEdit} from '../../tag-aliases-tab/dashboard-alias-edit/dashboard-alias-edit';
import {ModalComponent} from '../../../../../../ui/core/interface/modal-component.interface';
import {
    TagAliasDTO, TagAliasV1RestControllerService,
    TagCategoryDTO,
    TagCategoryV1RestControllerService,
    TagDTO
} from '../../../../../../openapi/generated/storage';
import {PaginationComponent} from '../../../../../../ui/pagination/pagination.component';
import {DashboardTagsService} from '../../dashboard-tags.service';
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
import {SpecOperator} from '../../../../../../store/common/specification';

export interface EditTagFormModel {
    name: string;
    categoryName: string;
    categoryId: string;
}

@Component({
    selector: 'app-dashboard-tag-edit',
    imports: [
        InputFieldComponent,
        LabelComponent,
        DynamicDropdownComponent,
        FormField,
        TranslatePipe,
        ModalDialogComponent,
        PaginationComponent
    ],
    templateUrl: './dashboard-tag-edit.html',
    styleUrl: './dashboard-tag-edit.css',
})
export class DashboardTagEdit implements ModalComponent<TagDTO>, OnInit {
    private readonly tagCategoriesService = inject(TagCategoryV1RestControllerService);
    private readonly tagAliasService = inject(TagAliasV1RestControllerService);

    private readonly translatePipe = new TranslatePipe();

    data = input<{ data: TagDTO }>({data: {}});

    tagModel = signal<EditTagFormModel>({
        name: '',
        categoryName: '',
        categoryId: ''
    });

    aliasDataset = new CrudDataSet(new CrudDataSource(this.tagAliasService));
    aliases = computed(() => this.aliasDataset.getPageSignal()()?.content || []);
    removingAliasId = signal<string | null>(null);

    private readonly router = inject(Router);

    aliasDialog = viewChild<ModalDialogComponent<TagAliasDTO, { data: TagAliasDTO }>>('aliasDialog');
    readonly aliasEditComponent = DashboardAliasEdit;
    aliasDialogData = signal<{ data: TagAliasDTO }>({ data: {} });

    private readonly dashboardTagsService = inject(DashboardTagsService);

    createAlias() {
        this.aliasDialogData.set({
            data: {
                targetTag: this.data().data
            }
        });
        setTimeout(() => this.aliasDialog()?.openModal());
    }

    onAliasSave(data: TagAliasDTO): Observable<boolean> {
        return this.dashboardTagsService.createAlias({
            alias: data.alias,
            targetTag: data.targetTag
        }).pipe(
            map(() => {
                this.aliasDataset.fetch().subscribe();
                return true;
            }),
            catchError(() => of(false))
        );
    }

    private readonly route = inject(ActivatedRoute);

    navigateToAlias(aliasName: string) {
        if (!aliasName) return;
        const libraryId = this.route.snapshot.paramMap.get('libraryId') || this.route.parent?.snapshot.paramMap.get('libraryId') || this.route.parent?.parent?.snapshot.paramMap.get('libraryId');
        if (libraryId) {
            this.router.navigate(['/dashboard', libraryId, 'tags', 'tab', 'aliases'], {
                queryParams: { query: aliasName }
            });
        }
    }

    removeAlias(aliasId: string) {
        this.removingAliasId.set(aliasId);
        this.aliasDataset.deleteById(aliasId).subscribe({
            next: () => {
                this.removingAliasId.set(null);
                this.aliasDataset.fetch().subscribe();
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
    });

    categoryDataset = new CrudDataSet(new CrudDataSource(this.tagCategoriesService));

    ngOnInit() {
        const inputData = this.data();
        if (inputData?.data) {
            this.tagModel.set({
                name: inputData.data.name || '',
                categoryName: inputData.data.category?.name ?? (inputData.data.category?.id ? 'Tag category id ' + inputData.data.category.id : ''),
                categoryId: inputData.data.category?.id || ''
            });

            if (inputData.data.id) {
                this.aliasDataset.setSpecification({
                    field: 'targetTag.id',
                    operator: SpecOperator.EQUALS,
                    value: inputData.data.id
                });
                this.aliasDataset.setPageable({ page: 0, size: 10 });
                this.aliasDataset.fetch().subscribe();
            }
        }
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

    onAliasPageChange(page: number) {
        this.aliasDataset.setPageable({
            ...this.aliasDataset.getPageableSignal()(),
            page
        });
        this.aliasDataset.fetch().subscribe();
    }

    get isValid(): boolean {
        return this.tagForm().valid();
    }

    onSaveReturnValue(): TagDTO {
        return {
            ...this.data().data,
            name: this.tagModel().name,
            category: this.tagModel().categoryId ? { id: this.tagModel().categoryId } : undefined
        } as TagDTO;
    }
}
