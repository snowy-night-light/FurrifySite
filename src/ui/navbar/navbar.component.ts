import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../shared/service/auth.service';

export type LanguageData = {
    name: string,
    languageCode: string,
    unicodeFlag: string
};

export type NavItem = {
    name: string,
    route: string,
    iconClassList: string[]
};

export type NavUserItem = {
    text: string,
    iconClassList: string[],
    onClick: () => void
};


@Component({
  selector: 'ui-navbar',
    imports: [NgOptimizedImage, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
    authService = inject(AuthService);

    userOptions: NavUserItem[] = [
        {
            text: 'ui.navbar.logout',
            iconClassList: ['bi', 'bi-box-arrow-right'],
            onClick: () => {
                this.authService.logout();
            }
        }
    ];

    navItems: NavItem[] = [
        {
            name: 'Dashboard',
            route: '/',
            iconClassList: ['bi', 'bi-grid-1x2']
        }
    ];

    languages: LanguageData[] = [
        {
            name: "English",
            languageCode: 'en-US',
            unicodeFlag: '🇺🇸'
        }
    ]

    private translate = inject(TranslateService);

    protected onLanguageChange(languageCode: string) {
        this.translate.use(languageCode);

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }
}
