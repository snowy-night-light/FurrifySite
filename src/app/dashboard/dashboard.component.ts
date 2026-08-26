import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SidebarComponent, SidebarItem} from '../../ui/sidebar/sidebar.component';
import {EndpointDataSet} from '../../store/common/endpoint/endpoint-data-set';
import {EndpointDataSource} from '../../store/common/endpoint/endpoint-data-source';
import {CrudDataSet} from '../../store/common/crud/crud-data-set';
import {CrudDataSource} from '../../store/common/crud/crud-data-source';
import {UiToastService} from '../../ui/core/service/ui-toast.service';
import {LibraryV1RestControllerService, UserStatisticsV1RestControllerService} from '../../openapi/generated/storage';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterModule, SidebarComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
    private readonly toastService = inject(UiToastService);
    private readonly libraryService = inject(LibraryV1RestControllerService);

    librariesDataSet = new CrudDataSet(new CrudDataSource(this.libraryService));
    areLibrariesFetching = computed(() => this.librariesDataSet.getIsFetchingSignal()());
    librariesData = computed(() => this.librariesDataSet.getPageSignal()());

    sidebarItems = computed<SidebarItem[]>(() => {
        const items: SidebarItem[] = [
            {labelKey: 'app.dashboard.sidebar.navigation', isTitle: true},
            {
                labelKey: 'app.dashboard.sidebar.overview',
                iconClass: 'bi bi-bar-chart-fill',
                route: ['/dashboard/overview']
            },
            {labelKey: 'app.dashboard.sidebar.libraries', isTitle: true},
        ];

        if (this.areLibrariesFetching() && (!this.librariesData() || this.librariesData()?.content?.length === 0)) {
            items.push({ isLoading: true });
        } else {
            this.librariesData()?.content?.forEach(library => {
                items.push({
                    labelKey: library.title ?? 'app.dashboard.sidebar.library', iconClass: 'bi bi-folder2',
                    children: [
                        {labelKey: 'app.dashboard.sidebar.collections', iconClass: 'bi bi-collection'},
                        {labelKey: 'app.dashboard.sidebar.posts', iconClass: 'bi bi-file-earmark-text'},
                        {labelKey: 'app.dashboard.sidebar.tags', iconClass: 'bi bi-tags', route: ['/dashboard', library.id, 'tags']},
                        {labelKey: 'app.dashboard.sidebar.artists', iconClass: 'bi bi-palette'},
                        {labelKey: 'app.dashboard.sidebar.books', iconClass: 'bi bi-book'},
                        {labelKey: 'app.dashboard.sidebar.brokers', iconClass: 'bi bi-robot', isDisabled: true}
                    ]
                });
            });
        }

        items.push(
            {isDivider: true},
            {labelKey: 'app.dashboard.sidebar.manageLibraries', iconClass: 'bi bi-gear', textClass: 'text-primary'}
        );

        return items;
    });

    ngOnInit(): void {
        this.librariesDataSet.setPageable({
            size: 100,
            sort: ['title', 'asc']
        });
        this.fetchLibraries();
    }

    fetchLibraries() {
        this.librariesDataSet.fetch().subscribe();
    }
}
