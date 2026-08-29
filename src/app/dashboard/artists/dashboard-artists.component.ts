import {Component, computed, inject, OnInit, signal, viewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {SearchBarComponent} from '../../../ui/search-bar/search-bar.component';
import {RefreshButtonComponent} from '../../../ui/refresh-button/refresh-button.component';
import {PaginationComponent} from '../../../ui/pagination/pagination.component';
import {DashboardArtistsService} from './dashboard-artists.service';
import {combineLatest, Observable, of} from 'rxjs';
import {debounceTime, map, catchError} from 'rxjs/operators';
import {ArtistDTO} from '../../../openapi/generated/storage';
import {ModalDialogComponent} from '../../../ui/modal-dialog/modal-dialog.component';
import {DashboardArtistEditComponent} from './dashboard-artist-edit/dashboard-artist-edit.component';
import {environment} from '../../../environments/environment';
import {NgOptimizedImage, AsyncPipe} from '@angular/common';

@Component({
    selector: 'app-dashboard-artists',
    imports: [
        TranslatePipe,
        SearchBarComponent,
        RefreshButtonComponent,
        PaginationComponent,
        ModalDialogComponent,
        NgOptimizedImage,
        AsyncPipe
    ],
    templateUrl: './dashboard-artists.component.html',
    styleUrl: './dashboard-artists.component.css',
})
export class DashboardArtistsComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    protected readonly dashboardArtistsService = inject(DashboardArtistsService);

    areArtistsFetching = computed(() => this.dashboardArtistsService.artistsDataSet.getIsFetchingSignal()());
    artistsData = computed(() => this.dashboardArtistsService.artistsDataSet.getPageSignal()());
    artistsPageable = computed(() => this.dashboardArtistsService.artistsDataSet.getPageableSignal()());

    currentQuery = signal<string>('');
    currentLibraryId = signal<string | undefined>(undefined);

    artistToEdit = signal<ArtistDTO | null>(null);
    artistDialogData = computed(() => this.artistToEdit() ? { data: this.artistToEdit()! } : undefined);
    artistDialog = viewChild<ModalDialogComponent<ArtistDTO, { data: ArtistDTO }>>('artistDialog');

    protected readonly DashboardArtistEdit = DashboardArtistEditComponent;

    ngOnInit() {
        combineLatest([
            this.route.paramMap,
            this.route.queryParamMap
        ]).pipe(
            debounceTime(0)
        ).subscribe(([params, queryParams]) => {
            const libraryId = params.get('libraryId');
            const query = queryParams.get('query') || '';
            const page = parseInt(queryParams.get('page') || '0', 10) || 0;

            this.currentQuery.set(query);

            if (libraryId) {
                this.currentLibraryId.set(libraryId);

                this.dashboardArtistsService.artistsDataSet.setPageable({
                    ...this.artistsPageable(),
                    page
                });

                this.dashboardArtistsService.fetchArtists(query, libraryId);
            }
        });
    }

    protected onQueryChanged(query: string) {
        if (query === this.currentQuery()) return;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { query: query || null, page: 0 },
            queryParamsHandling: 'merge'
        });
    }

    refreshArtists() {
        const libraryId = this.currentLibraryId();
        if (libraryId) {
            const query = this.route.snapshot.queryParamMap.get('query') || '';
            this.dashboardArtistsService.fetchArtists(query, libraryId);
        }
    }

    openAddModal() {
        this.artistToEdit.set({
            library: this.currentLibraryId() ? { id: this.currentLibraryId() } : undefined
        });
        setTimeout(() => this.artistDialog()?.openModal());
    }

    openEditModal(artist: ArtistDTO) {
        this.artistToEdit.set(artist);
        setTimeout(() => this.artistDialog()?.openModal());
    }

    protected onArtistSave = (dto: ArtistDTO): Observable<boolean> => {
        const func: Observable<ArtistDTO> = (dto.id) ? this.dashboardArtistsService.updateArtist(dto) : this.dashboardArtistsService.createArtist(dto);

        return func.pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    deletingArtists = signal<Set<string>>(new Set());

    deleteArtist(artist: ArtistDTO) {
        if (artist.id) {
            this.deletingArtists.update(set => { set.add(artist.id!); return new Set(set); });
            this.dashboardArtistsService.deleteArtist(artist.id).subscribe({
                next: () => {
                    this.deletingArtists.update(set => { set.delete(artist.id!); return new Set(set); });
                },
                error: () => {
                    this.deletingArtists.update(set => { set.delete(artist.id!); return new Set(set); });
                }
            });
        }
    }

    getPrimaryNickname(artist: ArtistDTO): string {
        if (!artist.nicknames || artist.nicknames.length === 0) {
            return 'Unknown';
        }

        // Sort by priority or just take the first one
        const sorted = [...artist.nicknames].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
        return sorted[0].nickname;
    }

    protected readonly environment = environment;
}
