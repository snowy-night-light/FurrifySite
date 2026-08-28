import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {UiToastService} from '../../ui/core/service/ui-toast.service';
import {inject, Signal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {BaseDataSource} from './base-data-source';

export abstract class BaseDataSet {

    protected readonly toastService: UiToastService = inject(UiToastService);
    private readonly translateService = inject(TranslateService);

    protected constructor(protected dataSource: BaseDataSource) {
    }

    getIsFetchingSignal(): Signal<boolean> {
        return this.dataSource.getIsFetchingSignal();
    }

    protected handleError<T>(titleKey?: string) {
        return (source: Observable<T>) => source.pipe(
            catchError((error) => {
                const titleText = titleKey ? this.translateService.instant(titleKey) : error.message;
                const backendMessage = error?.status === 0 ? null : error?.error?.message;
                const isServerError = error?.status >= 500;

                if (backendMessage && !isServerError) {
                    this.toastService.addToast({
                        iconClassList: ['bi', 'bi-x-circle'],
                        text: backendMessage,
                        duration: 7000,
                        color: 'error'
                    });
                } else {
                    this.toastService.addToast({
                        iconClassList: ['bi', 'bi-x-circle'],
                        text: titleText,
                        duration: 7000,
                        color: 'error'
                    });

                    if (backendMessage && isServerError) {
                        this.toastService.addToast({
                            iconClassList: ['bi', 'bi-x-circle'],
                            text: backendMessage,
                            duration: 7000,
                            color: 'error'
                        });
                    }
                }

                return throwError(() => error);
            })
        );
    }
}
