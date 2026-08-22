import {Component, inject, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../shared/service/auth.service';

export type LanguageData = {
    name: string,
    languageCode: string,
    unicodeFlag: string
};

export type NavItem = {
    nameKey: string,
    route: string,
    iconClassList: string[]
};

export type NavUserItem = {
    textKey: string,
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
    private translate = inject(TranslateService);
    authService = inject(AuthService);

    userOptions = input.required<NavUserItem[]>();
    navItems = input.required<NavItem[]>();

    languages = input.required<LanguageData[]>();

    protected onLanguageChange(languageCode: string) {
        this.translate.use(languageCode);

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }
}
