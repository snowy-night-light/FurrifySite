import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {UiToastService} from '../../ui/core/service/ui-toast.service';
import {Signal} from '@angular/core';

import {BaseDataSource} from './base-data-source';

export abstract class BaseDataSet {

    protected constructor(protected dataSource: BaseDataSource, protected toastService: UiToastService) {
    }

    getIsFetchingSignal(): Signal<boolean> {
        return this.dataSource.getIsFetchingSignal();
    }

    protected handleError<T>(titleKey?: string) {
        return (source: Observable<T>) => source.pipe(
            catchError((error) => {
                this.toastService.addToast({
                    iconClassList: ['bi', 'bi-x-circle'],
                    text: titleKey ?? error.message,
                    duration: 7000,
                    color: 'error'
                });

                return throwError(() => error);
            })
        );
    }
}
