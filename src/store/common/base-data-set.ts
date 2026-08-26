import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {UiToastService} from '../../ui/core/service/ui-toast.service';
import {inject, Signal} from '@angular/core';

import {BaseDataSource} from './base-data-source';
import {TranslatePipe} from '@ngx-translate/core';

export abstract class BaseDataSet {

    protected readonly toastService: UiToastService = inject(UiToastService);
    private readonly translatePipe = new TranslatePipe();

    protected constructor(protected dataSource: BaseDataSource) {
    }

    getIsFetchingSignal(): Signal<boolean> {
        return this.dataSource.getIsFetchingSignal();
    }

    protected handleError<T>(titleKey?: string) {
        return (source: Observable<T>) => source.pipe(
            catchError((error) => {
                this.toastService.addToast({
                    iconClassList: ['bi', 'bi-x-circle'],
                    text: this.translatePipe.transform(titleKey) ?? error.message,
                    duration: 7000,
                    color: 'error'
                });

                return throwError(() => error);
            })
        );
    }
}
