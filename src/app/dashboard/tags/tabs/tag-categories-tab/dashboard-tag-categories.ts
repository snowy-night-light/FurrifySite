import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {combineLatest} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {TranslatePipe} from '@ngx-translate/core';
import {RefreshButtonComponent} from '../../../../../ui/refresh-button/refresh-button.component';
import {PaginationComponent} from '../../../../../ui/pagination/pagination.component';
import {ActivatedRoute} from '@angular/router';
import {DashboardTagsService} from '../dashboard-tags.service';

@Component({
    selector: 'app-dashboard-tags-categories-tab',
    imports: [
        RefreshButtonComponent,
        PaginationComponent,
        TranslatePipe
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

    onPageChange(page: number) {

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
