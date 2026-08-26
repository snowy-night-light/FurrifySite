import {Component, computed, contentChild, ElementRef, input, OnInit, effect, untracked, signal, output} from '@angular/core';
import {BaseDataSet} from '../../store/common/base-data-set';
import {CrudDataSet} from '../../store/common/crud/crud-data-set';
import {BaseEntity} from '../../openapi/base/base-entity.interface';
import {CreateRequest} from '../../openapi/base/create-request.interface';
import {PatchRequest} from '../../openapi/base/patch-request.interface';
import {Field, FormField} from '@angular/forms/signals';
import {InputFieldComponent} from '../input-field/input-field.component';
import {TranslatePipe} from '@ngx-translate/core';
import {EntitySpecification, SpecConnector, SpecOperator} from '../../store/common/specification';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
export interface DynamicDropdownItem<VALUE> {
    text: string;
    value: VALUE;
    iconClasses?: string[];
    colorHex?: string;
}

export interface DynamicDropdownSearchGroup {
    field: string;
    valueType: 'string' | 'number';
}

@Component({
    selector: 'ui-dynamic-dropdown',
    imports: [
        TranslatePipe
    ],
    templateUrl: './dynamic-dropdown.component.html',
    styleUrl: './dynamic-dropdown.component.css',
    host: {
        '(document:click)': 'onClickOutside($event)',
        '(mousedown)': 'onMousedown()',
        '(document:mouseup)': 'onDocumentMouseup()',
        '(focusout)': 'onFocusOut($event)',
        '(keydown)': 'onKeydown($event)',
        class: 'block w-full'
    }
})
export class DynamicDropdownComponent<DTO extends BaseEntity, CREATE_REQ extends CreateRequest, PATCH_REQ extends PatchRequest, ITEM_VALUE> implements OnInit {
    isOpen = false;

    inputRef = contentChild.required(InputFieldComponent);
    dataset = input.required<CrudDataSet<DTO, CREATE_REQ, PATCH_REQ>>();
    searchGroup = input.required<DynamicDropdownSearchGroup[]>();
    mapDisplayItem = input.required<(dto: DTO) => DynamicDropdownItem<ITEM_VALUE>>();
    isFetching = computed(() => this.dataset().getIsFetchingSignal()())

    page = computed(() => this.dataset().getPageSignal()());

    items = signal<DTO[]>([]);
    hasMorePages = signal(true);
    currentPage = signal(0);
    pageSize = 50;

    itemSelected = output<ITEM_VALUE>();
    itemUnselect = output<void>();

    private isMousedownInside = false;

    onMousedown() {
        this.isMousedownInside = true;
    }

    onDocumentMouseup() {
        this.isMousedownInside = false;
    }

    onFocusOut(event: FocusEvent) {
        if (!this.isMousedownInside && !this.elementRef.nativeElement.contains(event.relatedTarget as Node)) {
            this.isOpen = false;
        }
    }

    onKeydown(event: KeyboardEvent) {
        if (event.key === 'Backspace' || event.code === 'Backspace') {
            this.itemUnselect.emit();
        }
    }

    isDebouncing = signal(false);
    private lastSearchValue?: string;

    private searchSubject = new Subject<string>();

    constructor(private elementRef: ElementRef) {
        effect(() => {
            const inputField = this.inputRef();
            if (inputField) {
                const inputValue = inputField.value();
                untracked(() => {
                    if (this.lastSearchValue !== inputValue) {
                        this.isDebouncing.set(true);
                        this.items.set([]);
                        this.searchSubject.next(inputValue || '');
                        this.lastSearchValue = inputValue;
                    }
                });
            }
        });

        effect(() => {
            const page = this.dataset().getPageSignal()();
            untracked(() => {
                if (page) {
                    const content = page.content || [];
                    const currentItems = page.page?.number === 0 ? [] : this.items();
                    this.items.set([...currentItems, ...content]);
                    this.hasMorePages.set((page.page?.number ?? 0) < ((page.page?.totalPages ?? 1) - 1));
                    if (page.page?.number !== undefined) {
                        this.currentPage.set(page.page.number);
                    }
                }
            });
        });
    }

    ngOnInit(): void {
        this.inputRef().focus.subscribe(() => this.onInputFocus());
        this.resetAndFetch();

        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(value => {
            this.performSearch(value);
        });
    }

    performSearch(value: string) {
        this.isDebouncing.set(false);
        this.items.set([]);
        this.currentPage.set(0);

        if (!value || value.trim() === '') {
            this.dataset().setSpecification(undefined);
        } else {
            const specs: EntitySpecification[] = this.searchGroup().map(specGroup => {
                let operator = SpecOperator.EQUALS;
                if (specGroup.valueType === 'string') {
                    operator = SpecOperator.LIKE;
                }

                return {
                    field: specGroup.field,
                    operator: operator,
                    value: value
                };
            });
            this.dataset().setSpecification({
                connector: SpecConnector.OR,
                conditions: specs
            });
        }

        this.dataset().setPageable({
            ...this.dataset().getPageableSignal()(),
            page: 0
        });
        this.dataset().fetch().subscribe();
    }

    resetAndFetch() {
        this.items.set([]);
        this.currentPage.set(0);
        this.dataset().setPageable({ page: 0, size: this.pageSize });
        this.dataset().fetch().subscribe();
    }

    onClickOutside(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }

    onInputFocus() {
        if (!this.isOpen) {
            this.resetAndFetch();
            this.isOpen = true;
        }
    }


    selectItem(item: ITEM_VALUE) {
        this.itemSelected.emit(item);
        this.isOpen = false;
    }

    onScroll(event: Event) {
        const target = event.target as HTMLElement;
        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
            if (!this.isFetching() && this.hasMorePages()) {
                this.fetchNextPage();
            }
        }
    }

    fetchNextPage() {
        const nextPage = this.currentPage() + 1;
        this.dataset().setPageable({ page: nextPage, size: this.pageSize });
        this.dataset().fetch().subscribe();
    }
}
