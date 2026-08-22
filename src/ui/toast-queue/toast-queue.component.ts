import {Component, computed, inject} from '@angular/core';
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
}
