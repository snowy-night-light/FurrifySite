import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent, SidebarItem } from '../../ui/sidebar/sidebar.component';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterModule, SidebarComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
    sidebarItems: SidebarItem[] = [
        { labelKey: 'app.dashboard.sidebar.navigation', isTitle: true },
        { labelKey: 'app.dashboard.sidebar.overview', iconClass: 'bi bi-bar-chart-fill', route: ['/dashboard/overview'] },
        { labelKey: 'app.dashboard.sidebar.libraries', isTitle: true },
        {
            labelKey: 'Art Assets', iconClass: 'bi bi-folder2',
            children: [
                { labelKey: 'app.dashboard.collections', iconClass: 'bi bi-collection' },
                { labelKey: 'app.dashboard.posts', iconClass: 'bi bi-file-earmark-text' },
                { labelKey: 'app.dashboard.tags', iconClass: 'bi bi-tags' },
                { labelKey: 'app.dashboard.artists', iconClass: 'bi bi-palette' },
                { labelKey: 'app.dashboard.brokers', iconClass: 'bi bi-robot', isDisabled: true }
            ]
        },
        {
            labelKey: 'Music Library', iconClass: 'bi bi-folder2',
            children: [
                { labelKey: 'app.dashboard.collections', iconClass: 'bi bi-collection' },
                { labelKey: 'app.dashboard.posts', iconClass: 'bi bi-file-earmark-text' },
                { labelKey: 'app.dashboard.tags', iconClass: 'bi bi-tags' },
                { labelKey: 'app.dashboard.artists', iconClass: 'bi bi-palette' },
                { labelKey: 'app.dashboard.brokers', iconClass: 'bi bi-robot', isDisabled: true }
            ]
        },
        {
            labelKey: 'Video Projects', iconClass: 'bi bi-folder2',
            children: [
                { labelKey: 'app.dashboard.collections', iconClass: 'bi bi-collection' },
                { labelKey: 'app.dashboard.posts', iconClass: 'bi bi-file-earmark-text' },
                { labelKey: 'app.dashboard.tags', iconClass: 'bi bi-tags' },
                { labelKey: 'app.dashboard.artists', iconClass: 'bi bi-palette' },
                { labelKey: 'app.dashboard.brokers', iconClass: 'bi bi-robot', isDisabled: true }
            ]
        },
        {
            labelKey: 'Animations', iconClass: 'bi bi-folder2',
            children: [
                { labelKey: 'app.dashboard.collections', iconClass: 'bi bi-collection' },
                { labelKey: 'app.dashboard.posts', iconClass: 'bi bi-file-earmark-text' },
                { labelKey: 'app.dashboard.tags', iconClass: 'bi bi-tags' },
                { labelKey: 'app.dashboard.artists', iconClass: 'bi bi-palette' },
                { labelKey: 'app.dashboard.brokers', iconClass: 'bi bi-robot', isDisabled: true }
            ]
        },

        { isDivider: true },
        { labelKey: 'app.dashboard.sidebar.manageLibraries', iconClass: 'bi bi-gear', textClass: 'text-primary' }
    ];
}
