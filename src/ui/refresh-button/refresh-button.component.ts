import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ui-refresh-button',
    imports: [CommonModule],
    template: `
        <button class="btn btn-ghost btn-circle refresh-btn" (keydown.enter)="onRefresh()" (click)="onRefresh()" [disabled]="isRefreshing()" aria-label="Refresh">
            <i class="bi bi-arrow-clockwise text-xl inline-block transition-transform duration-700 ease-in-out"
               [style.transform]="'rotate(' + refreshRotation() + 'deg)'"></i>
        </button>
    `,
    styles: []
})
export class RefreshButtonComponent {
    isRefreshing = input(false);
    refresh = output<void>();

    refreshRotation = signal(0);

    onRefresh() {
        this.refreshRotation.update(r => r + 360);
        this.refresh.emit();
    }
}
