import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { RefreshButtonComponent } from '../refresh-button/refresh-button.component';

export interface SidebarSubItem {
    labelKey: string;
    iconClass?: string;
    route?: string | any[];
    isDisabled?: boolean;
}

export interface SidebarItem {
    labelKey?: string;
    iconClass?: string;
    route?: string | any[];
    isActive?: boolean;
    isDisabled?: boolean;
    isTitle?: boolean;
    isDivider?: boolean;
    isLoading?: boolean;
    textClass?: string;
    children?: SidebarSubItem[];
}

@Component({
    selector: 'ui-sidebar',
    imports: [CommonModule, RouterModule, TranslatePipe, RefreshButtonComponent],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    items = input<SidebarItem[]>([]);
    showRefreshBtn = input(false);
    isRefreshing = input(false);

    refresh = output<void>();

    isMobileMenuOpen = signal(false);

    constructor(private router: Router) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.isMobileMenuOpen.set(false);
        });
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen.update(v => !v);
    }
}
