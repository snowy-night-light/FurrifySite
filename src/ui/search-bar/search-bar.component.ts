import {Component, input, output, signal, effect, untracked} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {debounceTime} from 'rxjs/operators';
import {InputFieldComponent} from '../input-field/input-field.component';
import {form, FormField} from '@angular/forms/signals';

export interface SearchData {
    query: string;
}

@Component({
    selector: 'ui-search-bar',
    imports: [InputFieldComponent, FormField],
    templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
    queryChange = output<string>();

    searchModel = signal<SearchData>({ query: '' });
    query = input<string>('');
    placeholder = input<string>('');

    searchForm = form(this.searchModel, () => {});

    constructor() {
        effect(() => {
            const newQuery = this.query();
            untracked(() => {
                if (this.searchModel().query !== newQuery) {
                    this.searchModel.update(m => ({ ...m, query: newQuery }));
                }
            });
        });

        toObservable(this.searchModel)
            .pipe(debounceTime(300))
            .subscribe(model => {
                this.queryChange.emit(model.query);
            });
    }
}
