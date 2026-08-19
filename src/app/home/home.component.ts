import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <div class="flex-1 flex flex-col justify-center items-center p-12 text-center">
      <h1 class="text-4xl font-bold text-primary">Welcome to FurrifySite!</h1>
      <p class="mt-4 text-lg">You are securely authenticated and viewing the main dashboard.</p>
    </div>
  `,
  styles: ``
})
export class HomeComponent {}
