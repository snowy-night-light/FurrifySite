import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../shared/service/auth.service';

export type LanguageData = {
    name: string,
    languageCode: string,
    unicodeFlag: string
};

@Component({
  selector: 'ui-navbar',
    imports: [NgOptimizedImage, RouterLink, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
    authService = inject(AuthService);

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
