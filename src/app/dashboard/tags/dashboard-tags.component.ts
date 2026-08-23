import { Component, inject } from '@angular/core';
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

    tabs: TabItem[] = [
        { labelKey: 'app.dashboard.tags.tabs.tags.title', route: 'tab/tags' },
        { labelKey: 'app.dashboard.tags.tabs.categories.title', route: 'tab/categories' },
        { labelKey: 'app.dashboard.tags.tabs.aliases.title', route: 'tab/aliases' }
    ];

    protected onQueryChanged(query: string) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { query: query || null, page: 0 },
            queryParamsHandling: 'merge'
        });
    }
}
