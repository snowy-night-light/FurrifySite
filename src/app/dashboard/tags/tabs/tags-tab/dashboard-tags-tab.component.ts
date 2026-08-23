import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {combineLatest} from 'rxjs';
import {finalize, distinctUntilChanged} from 'rxjs/operators';
import {UiToastService} from '../../../../../ui/core/service/ui-toast.service';
import {LibraryV1RestControllerService, TagV1RestControllerService} from '../../../../../openapi/generated/storage';
import {CrudDataSet} from '../../../../../store/common/crud/crud-data-set';
import {CrudDataSource} from '../../../../../store/common/crud/crud-data-source';
import {TranslatePipe} from '@ngx-translate/core';
import {RefreshButtonComponent} from '../../../../../ui/refresh-button/refresh-button.component';
import {PaginationComponent} from '../../../../../ui/pagination/pagination.component';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardTagsService} from '../dashboard-tags.service';

@Component({
    selector: 'app-dashboard-tags-tab',
    imports: [
        RefreshButtonComponent,
        PaginationComponent,
        TranslatePipe
    ],
    templateUrl: './dashboard-tags-tab.component.html',
    styleUrl: './dashboard-tags-tab.component.css',
})
export class DashboardTagsTabComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly dashboardTagsService = inject(DashboardTagsService);

    areTagsFetching = computed(() => this.dashboardTagsService.tagsDataSet.getIsFetchingSignal()());
    tagsData = computed(() => this.dashboardTagsService.tagsDataSet.getPageSignal()());

    deletingTags = signal<Set<string>>(new Set());

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

                this.dashboardTagsService.tagsDataSet.setPageable({
                    ...this.dashboardTagsService.tagsDataSet.getPageableSignal()(),
                    page
                });

                this.dashboardTagsService.fetchTags(query, libraryId);
            }
        });
    }

    refreshTags() {
        const libraryId = this.currentLibraryId();
        if (libraryId) {
            const query = this.route.snapshot.queryParamMap.get('query') || '';
            this.dashboardTagsService.fetchTags(query, libraryId);
        }
    }

    onPageChange(page: number) {

    }

    deleteTag(id: string) {
        if (!id) return;

        this.deletingTags.update(s => {
            const next = new Set(s);
            next.add(id);
            return next;
        });

        this.dashboardTagsService.tagsDataSet.deleteById(id).pipe(
            finalize(() => {
                this.deletingTags.update(set => {
                    const next = new Set(set);
                    next.delete(id);
                    return next;
                });
            })
        ).subscribe();
    }
}
