import {Component, computed, inject, OnInit, signal, viewChild} from '@angular/core';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {RefreshButtonComponent} from '../../../../../ui/refresh-button/refresh-button.component';
import {PaginationComponent} from '../../../../../ui/pagination/pagination.component';
import {ActivatedRoute} from '@angular/router';
import {DashboardTagsService} from '../dashboard-tags.service';
import {ModalDialogComponent} from '../../../../../ui/modal-dialog/modal-dialog.component';
import {DashboardCategoryEdit} from './dashboard-category-edit/dashboard-category-edit';
import {TagCategoryDTO} from '../../../../../openapi/generated/storage';

@Component({
    selector: 'app-dashboard-tags-categories-tab',
    imports: [
        CommonModule,
        TranslatePipe,
        RefreshButtonComponent,
        PaginationComponent,
        ModalDialogComponent
    ],
    templateUrl: './dashboard-tag-categories.html',
    styleUrl: './dashboard-tag-categories.css',
})
export class DashboardTagCategories implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly dashboardTagsService = inject(DashboardTagsService);

    areCategoriesFetching = computed(() => this.dashboardTagsService.categoriesDataSet.getIsFetchingSignal()());
    categoriesData = computed(() => this.dashboardTagsService.categoriesDataSet.getPageSignal()());

    deletingCategories = signal<Set<string>>(new Set());

    currentLibraryId = signal<string | undefined>(undefined);

    ngOnInit() {
        combineLatest([
            this.route.parent!.paramMap,
            this.route.queryParamMap
        ]).subscribe(([params, queryParams]) => {
            const libraryId = params.get('libraryId');
            const query = queryParams.get('query') || '';
            const page = parseInt(queryParams.get('page') || '0', 10) || 0;

            if (libraryId) {
                this.currentLibraryId.set(libraryId);

                this.dashboardTagsService.categoriesDataSet.setPageable({
                    ...this.dashboardTagsService.categoriesDataSet.getPageableSignal()(),
                    page
                });

                this.dashboardTagsService.fetchCategories(query, libraryId);
            }
        });
    }

    refreshCategories() {
        const libraryId = this.currentLibraryId();
        if (libraryId) {
            const query = this.route.snapshot.queryParamMap.get('query') || '';
            this.dashboardTagsService.fetchCategories(query, libraryId);
        }
    }

    categoryToEdit = signal<TagCategoryDTO | null>(null);
    categoryDialog = viewChild<ModalDialogComponent<TagCategoryDTO, { data: TagCategoryDTO }>>('categoryDialog');
    readonly editComponent = DashboardCategoryEdit;

    categoryDialogData = computed(() => ({
        data: this.categoryToEdit() ?? {} as TagCategoryDTO
    }));

    openAddModal() {
        this.categoryToEdit.set({
            library: this.currentLibraryId() ? { id: this.currentLibraryId() } : undefined
        } as TagCategoryDTO);
        setTimeout(() => this.categoryDialog()?.openModal());
    }

    openEditModal(category: TagCategoryDTO) {
        this.categoryToEdit.set(category);
        setTimeout(() => this.categoryDialog()?.openModal());
    }

    onSaveCategory = (category: TagCategoryDTO): Observable<boolean> => {
        const action = category.id
            ? this.dashboardTagsService.updateCategory(category)
            : this.dashboardTagsService.createCategory(category);

        return action.pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    deleteCategory(id: string) {
        if (!id) return;

        this.deletingCategories.update(s => {
            const next = new Set(s);
            next.add(id);
            return next;
        });

        this.dashboardTagsService.categoriesDataSet.deleteById(id).pipe(
            finalize(() => {
                this.deletingCategories.update(set => {
                    const next = new Set(set);
                    next.delete(id);
                    return next;
                });
            })
        ).subscribe();
    }
}
