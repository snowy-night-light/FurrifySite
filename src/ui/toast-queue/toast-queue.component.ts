import {Component, computed, effect, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UiToastService} from '../core/service/ui-toast.service';

export interface ToastItem {
    id?: string;
    iconClassList?: string[],
    text: string;
    duration: number;
    color: 'info' | 'success' | 'error' | 'warning';
}


@Component({
    selector: 'ui-toast-queue',
    imports: [CommonModule],
    templateUrl: './toast-queue.component.html',
    styleUrl: './toast-queue.component.css',
})
export class ToastQueueComponent {
    private readonly toastService = inject(UiToastService);

    queue = computed(() => this.toastService.getQueueSignal()().slice(-3));

    constructor() {
        effect(() => {
            const items = this.queue();
            const popover = document.getElementById('toast-popover');
            if (popover) {
                if (items.length > 0) {
                    try { (popover as any).showPopover(); } catch(e) {}
                } else {
                    try { (popover as any).hidePopover(); } catch(e) {}
                }
            }
        });
    }
}
