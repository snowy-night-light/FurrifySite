import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TabsComponent, TabItem } from '../../../ui/tabs/tabs.component';
import {SearchBarComponent} from '../../../ui/search-bar/search-bar.component';

@Component({
    selector: 'app-tags',
    imports: [
        RouterModule,
        TranslatePipe,
        TabsComponent,
        SearchBarComponent
    ],
    templateUrl: './dashboard-tags.component.html',
    styleUrl: './dashboard-tags.component.css',
})
export class DashboardTagsComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    currentQuery = signal<string>('');

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.currentQuery.set(params['query'] || '');
        });
    }

    tabs: TabItem[] = [
        { labelKey: 'app.dashboard.tags.tabs.tags.title', route: 'tab/tags', queryParams: { page: null, query: null } },
        { labelKey: 'app.dashboard.tags.tabs.categories.title', route: 'tab/categories', queryParams: { page: null, query: null } },
        { labelKey: 'app.dashboard.tags.tabs.aliases.title', route: 'tab/aliases', queryParams: { page: null, query: null } }
    ];

    protected onQueryChanged(query: string) {
        if (query === this.currentQuery()) return;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { query: query || null, page: 0 },
            queryParamsHandling: 'merge'
        });
    }
}
