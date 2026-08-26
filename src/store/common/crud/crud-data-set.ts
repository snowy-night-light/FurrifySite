import { Observable } from 'rxjs';
import {BaseEntity} from '../../../openapi/base/base-entity.interface';
import {CreateRequest} from '../../../openapi/base/create-request.interface';
import {PatchRequest} from '../../../openapi/base/patch-request.interface';
import {CrudDataSource} from './crud-data-source';
import {UiToastService} from '../../../ui/core/service/ui-toast.service';
import {Page} from '../../../openapi/base/page.interface';
import {BaseDataSet} from '../base-data-set';
import {EntitySpecification} from '../specification';
import {Pageable} from '../../../openapi/base/pageable.interface';
import {Signal} from '@angular/core';

export class CrudDataSet<DTO extends BaseEntity, CREATE_REQ extends CreateRequest, PATCH_REQ extends PatchRequest> extends BaseDataSet {

    constructor(protected override dataSource: CrudDataSource<DTO, CREATE_REQ, PATCH_REQ>) {
        super(dataSource);
    }

    getSpecificationSignal() {
        return this.dataSource.getSpecificationSignal();
    }

    setSpecification(spec: EntitySpecification | undefined): void {
        this.dataSource.setSpecification(spec);
    }

    setPageable(pageable: Pageable) {
        this.dataSource.setPageable(pageable);
    }

    getPageableSignal(): Signal<Pageable> {
        return this.dataSource.getPageableSignal();
    }

    getById(id: string): Observable<DTO> {
        return this.dataSource.getById(id).pipe(
            this.handleError(
                'store.dataset.errors.getByIdFailedTitle'
            )
        );
    }

    deleteById(id: string): Observable<void> {
        return this.dataSource.deleteById(id).pipe(
            this.handleError(
                'store.dataset.errors.deleteByIdFailedTitle'
            )
        );
    }

    updateById(id: string, request: PATCH_REQ): Observable<DTO> {
        return this.dataSource.updateById(id, request).pipe(
            this.handleError('store.dataset.errors.updateByIdFailedTitle')
        );
    }

    create(request: CREATE_REQ): Observable<DTO> {
        return this.dataSource.create(request).pipe(
            this.handleError('store.dataset.errors.createFailedTitle')
        );
    }

    fetch(): Observable<Page<DTO>> {
        return this.dataSource.fetch().pipe(
            this.handleError('store.dataset.errors.fetchFailedTitle')
        );
    }

    getPageSignal(): Signal<Page<DTO> | undefined> {
        return this.dataSource.getPageSignal();
    }
}
