import {Signal, signal} from '@angular/core';
import {defer, Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';

export abstract class BaseDataSource {
    protected isFetching = signal<boolean>(false);

    getIsFetchingSignal(): Signal<boolean> {
        return this.isFetching.asReadonly();
    }

    protected track<T>(): (source: Observable<T>) => Observable<T> {
        return (source: Observable<T>) => {
            return defer(() => {
                this.isFetching.set(true);
                return source.pipe(
                    finalize(() => this.isFetching.set(false))
                );
            });
        };
    }
}
