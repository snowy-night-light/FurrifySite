import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LanguageData, NavbarComponent, NavItem, NavUserItem} from '../ui/navbar/navbar.component';
import {AuthService} from '../shared/service/auth.service';
import {ToastQueueComponent} from '../ui/toast-queue/toast-queue.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarComponent, ToastQueueComponent],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    protected readonly title = signal('FurrifySite');
    authService = inject(AuthService);

    languages: LanguageData[] = [
        {
            name: "English",
            languageCode: 'en-US',
            unicodeFlag: '🇺🇸'
        }
    ];

    userOptions: NavUserItem[] = [
        {
            textKey: 'app.navbar.logout',
            iconClassList: ['bi', 'bi-box-arrow-right'],
            onClick: () => {
                this.authService.logout();
            }
        }
    ];

    navItems: NavItem[] = [
        {
            nameKey: 'app.navbar.dashboard',
            route: '/dashboard/overview',
            iconClassList: ['bi', 'bi-grid-1x2']
        }
    ];
}
