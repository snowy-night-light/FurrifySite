import {Component, input, signal, Type, viewChild, ViewContainerRef, ComponentRef} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ModalComponent} from '../core/interface/modal-component.interface';
import {Observable} from 'rxjs';

@Component({
    selector: 'ui-modal-dialog',
    imports: [
        TranslatePipe
    ],
    templateUrl: './modal-dialog.component.html',
    styleUrl: './modal-dialog.component.css',
})
export class ModalDialogComponent<RETURN_TYPE, DATA> {
    id: string = self.crypto.randomUUID();

    component = input.required<Type<ModalComponent<RETURN_TYPE>>>();

    onSave = input<(value: RETURN_TYPE) => Observable<boolean>>();
    onClose = input<() => void>();
    data = input<{data: DATA}>();
    titleKey = input<string>();

    isOpen = signal(false);
    isSaving = signal(false);

    container = viewChild('container', { read: ViewContainerRef });
    componentRef?: ComponentRef<ModalComponent<RETURN_TYPE>>;

    openModal(): void {
        this.isOpen.set(true);
        const container = this.container();
        if (container) {
            container.clear();
            this.componentRef = container.createComponent(this.component());
            if (this.data()) {
                this.componentRef.setInput('data', this.data());
            }
        }
        (document.getElementById(this.id) as HTMLDialogElement).showModal();
    }

    onDialogClose(): void {
        setTimeout(() => {
            this.isOpen.set(false);
            const container = this.container();
            if (container) {
                container.clear();
            }
            this.componentRef = undefined;
        }, 300);
    }

    handleSave(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        
        if (!this.componentRef || !this.onSave()) return;
        
        const instance = this.componentRef.instance;
        
        if (instance.isValid !== undefined && !instance.isValid) {
            return;
        }

        if (!instance.onSaveReturnValue) {
            return;
        }

        const value = instance.onSaveReturnValue();
        const saveFn = this.onSave();
        
        if (saveFn) {
            this.isSaving.set(true);
            saveFn(value).subscribe({
                next: (success) => {
                    this.isSaving.set(false);
                    if (success) {
                        (document.getElementById(this.id) as HTMLDialogElement).close();
                    }
                },
                error: () => {
                    this.isSaving.set(false);
                }
            });
        }
    }
}
