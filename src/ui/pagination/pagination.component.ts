import {Component, computed, input, output, inject, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Page} from '../../openapi/base/page.interface';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {BaseEntity} from '../../openapi/base/base-entity.interface';

@Component({
    selector: 'ui-pagination',
    imports: [CommonModule],
    templateUrl: './pagination.component.html'
})
export class PaginationComponent<DTO extends BaseEntity> implements OnInit, OnDestroy {
    pageData = input<Page<DTO>>();
    currentPageInput = input<number>(0, { alias: 'currentPage' });
    totalPagesInput = input<number>(0, { alias: 'totalPages' });
    queryParam = input<string>();
    small = input<boolean>(false);
    
    pageChange = output<number>();

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private sub?: Subscription;

    private lastEmittedPage?: number;

    ngOnInit() {
        this.sub = this.route.queryParamMap.subscribe(params => {
            const queryParamName = this.queryParam();
            if (queryParamName) {
                const pageParam = params.get(queryParamName);
                const pageNum = pageParam ? parseInt(pageParam, 10) : 0;
                if (!isNaN(pageNum) && this.lastEmittedPage !== pageNum) {
                    this.lastEmittedPage = pageNum;
                    this.pageChange.emit(pageNum);
                }
            }
        });
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
    }

    currentPage = computed(() => {
        if (this.pageData()) {
            return this.pageData()?.page?.number ?? (this.pageData() as any)?.number ?? 0;
        }
        return this.currentPageInput();
    });

    totalPages = computed(() => {
        if (this.pageData()) {
            return this.pageData()?.page?.totalPages ?? (this.pageData() as any)?.totalPages ?? 0;
        }
        return this.totalPagesInput();
    });

    totalElementsInput = input<number>(0, { alias: 'totalElements' });
    totalElements = computed(() => {
        if (this.pageData()) {
            return this.pageData()?.page?.totalElements ?? (this.pageData() as any)?.totalElements ?? 0;
        }
        return this.totalElementsInput();
    });

    hasPrevious = computed(() => this.currentPage() > 0);
    hasNext = computed(() => this.currentPage() < this.totalPages() - 1);

    pages = computed(() => {
        const current = this.currentPage();
        const total = this.totalPages();
        if (total <= 0) return [];

        let start = Math.max(0, current - 2);
        let end = Math.min(total - 1, current + 2);

        if (current < 2) {
            end = Math.min(total - 1, start + 4);
        }
        if (current >= total - 2) {
            start = Math.max(0, end - 4);
        }

        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    });

    goToPage(page: number) {
        if (page >= 0 && page < this.totalPages() && page !== this.currentPage()) {
            const queryParamName = this.queryParam();
            if (queryParamName) {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { [queryParamName]: page },
                    queryParamsHandling: 'merge'
                });
            } else {
                this.pageChange.emit(page);
            }
        }
    }
}
