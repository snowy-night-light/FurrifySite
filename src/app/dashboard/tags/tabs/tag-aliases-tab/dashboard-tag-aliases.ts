import {Component, computed, inject, OnInit, signal, viewChild} from '@angular/core';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, debounceTime, finalize, map} from 'rxjs/operators';
import {TranslatePipe} from '@ngx-translate/core';
import {RefreshButtonComponent} from '../../../../../ui/refresh-button/refresh-button.component';
import {PaginationComponent} from '../../../../../ui/pagination/pagination.component';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardTagsService} from '../dashboard-tags.service';
import {ModalDialogComponent} from '../../../../../ui/modal-dialog/modal-dialog.component';
import {DashboardAliasEdit} from './dashboard-alias-edit/dashboard-alias-edit';
import {TagAliasDTO} from '../../../../../openapi/generated/storage';

@Component({
    selector: 'app-dashboard-tags-aliases-tab',
    imports: [
        RefreshButtonComponent,
        PaginationComponent,
        TranslatePipe,
        ModalDialogComponent
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
    readonly editComponent = DashboardAliasEdit;

    ngOnInit() {
        combineLatest([
            this.route.parent!.paramMap,
            this.route.queryParamMap
        ]).pipe(
            debounceTime(0)
        ).subscribe(([params, queryParams]) => {
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

    aliasToEdit = signal<TagAliasDTO | null>(null);
    aliasDialogData = computed(() => this.aliasToEdit() ? { data: this.aliasToEdit()! } : undefined);
    aliasDialog = viewChild<ModalDialogComponent<TagAliasDTO, TagAliasDTO>>('aliasDialog');

    openAddModal() {
        this.aliasToEdit.set({} as TagAliasDTO);
        setTimeout(() => this.aliasDialog()?.openModal());
    }

    openEditModal(alias: TagAliasDTO) {
        this.aliasToEdit.set(alias);
        setTimeout(() => this.aliasDialog()?.openModal());
    }

    onSaveAlias = (alias: TagAliasDTO): Observable<boolean> => {
        const action = alias.id
            ? this.dashboardTagsService.updateAlias(alias)
            : this.dashboardTagsService.createAlias(alias);

        return action.pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }
    private readonly router = inject(Router);

    navigateToTag(tagName: string) {
        if (!tagName) return;
        const libraryId = this.currentLibraryId();
        if (libraryId) {
            this.router.navigate(['/dashboard', libraryId, 'tags', 'tab', 'tags'], {
                queryParams: { query: tagName }
            });
        }
    }
}
