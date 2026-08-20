import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
    imports: [RouterLink, TranslatePipe],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 class="text-9xl font-black text-primary mb-4">404</h1>
      <h2 class="text-3xl font-bold mb-6">{{ 'notFound.pageNotFound' | translate }}</h2>
      <p class="text-lg text-base-content/70 mb-8 max-w-md">
        {{ 'notFound.pageNotFoundDescription' | translate }}
      </p>
      <a routerLink="/" class="btn btn-primary">
        {{ 'notFound.goBackHome' | translate }}
      </a>
    </div>
  `
})
export class NotFoundComponent {}
