import {Injectable, signal} from '@angular/core';
import {ToastItem} from '../../toast-queue/toast-queue.component';

@Injectable({
    providedIn: 'root'
})
export class UiToastService {
    private queue = signal<ToastItem[]>([]);

    addToast(toastItem: ToastItem) {
        if (!toastItem.id) {
            toastItem.id = self.crypto.randomUUID();
        }

        this.queue.set([...this.queue(), toastItem]);

        setTimeout(() => {
            this.removeToast(toastItem.id!);
        }, toastItem.duration);
    }

    removeToast(id: string) {
        this.queue.update(queue => queue.filter(item => item.id !== id));
    }

    getQueueSignal() {
        return this.queue.asReadonly();
    }
}
