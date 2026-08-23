import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {combineLatest} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {TranslatePipe} from '@ngx-translate/core';
import {RefreshButtonComponent} from '../../../../../ui/refresh-button/refresh-button.component';
import {PaginationComponent} from '../../../../../ui/pagination/pagination.component';
import {ActivatedRoute} from '@angular/router';
import {DashboardTagsService} from '../dashboard-tags.service';

@Component({
    selector: 'app-dashboard-tags-aliases-tab',
    imports: [
        RefreshButtonComponent,
        PaginationComponent,
        TranslatePipe
    ],
    templateUrl: './dashboard-tag-aliases.html',
    styleUrl: './dashboard-tag-aliases.css',
})
export class DashboardTagAliases implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly dashboardTagsService = inject(DashboardTagsService);

    areAliasesFetching = computed(() => this.dashboardTagsService.aliasesDataSet.getIsFetchingSignal()());
    aliasesData = computed(() => this.dashboardTagsService.aliasesDataSet.getPageSignal()());

    deletingAliases = signal<Set<string>>(new Set());

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

                this.dashboardTagsService.aliasesDataSet.setPageable({
                    ...this.dashboardTagsService.aliasesDataSet.getPageableSignal()(),
                    page
                });

                this.dashboardTagsService.fetchAliases(query, libraryId);
            }
        });
    }

    refreshAliases() {
        const libraryId = this.currentLibraryId();
        if (libraryId) {
            const query = this.route.snapshot.queryParamMap.get('query') || '';
            this.dashboardTagsService.fetchAliases(query, libraryId);
        }
    }

    onPageChange(page: number) {

    }

    deleteAlias(id: string) {
        if (!id) return;

        this.deletingAliases.update(s => {
            const next = new Set(s);
            next.add(id);
            return next;
        });

        this.dashboardTagsService.aliasesDataSet.deleteById(id).pipe(
            finalize(() => {
                this.deletingAliases.update(set => {
                    const next = new Set(set);
                    next.delete(id);
                    return next;
                });
            })
        ).subscribe();
    }
}
