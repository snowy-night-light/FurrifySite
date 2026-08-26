import {Component, computed, inject, OnInit, signal, viewChild} from '@angular/core';
import {combineLatest, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {TranslatePipe} from '@ngx-translate/core';
import {RefreshButtonComponent} from '../../../../../ui/refresh-button/refresh-button.component';
import {PaginationComponent} from '../../../../../ui/pagination/pagination.component';
import {ActivatedRoute} from '@angular/router';
import {DashboardTagsService} from '../dashboard-tags.service';
import {ModalDialogComponent} from '../../../../../ui/modal-dialog/modal-dialog.component';
import {DashboardTagEdit} from './dashboard-tag-edit/dashboard-tag-edit';
import {TagDTO} from '../../../../../openapi/generated/storage';

@Component({
    selector: 'app-dashboard-tags-tab',
    imports: [
        RefreshButtonComponent,
        PaginationComponent,
        TranslatePipe,
        ModalDialogComponent
    ],
    templateUrl: './dashboard-tags-tab.component.html',
    styleUrl: './dashboard-tags-tab.component.css',
})
export class DashboardTagsTabComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly dashboardTagsService = inject(DashboardTagsService);

    areTagsFetching = computed(() => this.dashboardTagsService.tagsDataSet.getIsFetchingSignal()());
    tagsData = computed(() => this.dashboardTagsService.tagsDataSet.getPageSignal()());
    tagsPageable = computed(() => this.dashboardTagsService.tagsDataSet.getPageableSignal()());

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
                    ...this.tagsPageable(),
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

    tagToEdit = signal<TagDTO | null>(null);
    tagDialogData = computed(() => this.tagToEdit() ? { data: this.tagToEdit()! } : undefined);
    tagDialog = viewChild<ModalDialogComponent<TagDTO, TagDTO>>('tagDialog');

    openAddModal() {
        this.tagToEdit.set({
            library: this.currentLibraryId() ? { id: this.currentLibraryId() } : undefined
        } as TagDTO);
        setTimeout(() => this.tagDialog()?.openModal());
    }

    openEditModal(tag: TagDTO) {
        this.tagToEdit.set(tag);
        setTimeout(() => this.tagDialog()?.openModal());
    }

    protected readonly DashboardTagEdit = DashboardTagEdit;

    protected onTagSave = (dto: TagDTO): Observable<boolean> => {
        const func: Observable<TagDTO> = (dto.id) ? this.dashboardTagsService.updateTag(dto) : this.dashboardTagsService.createTag(dto);

        return func.pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }
}
