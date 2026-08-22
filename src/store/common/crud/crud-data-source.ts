import {BaseEntity} from '../../../openapi/base/base-entity.interface';
import {Page} from '../../../openapi/base/page.interface';
import {signal} from '@angular/core';
import {PagedRestService} from '../../../openapi/base/paged-rest-service.interface';
import {CreateRequest} from '../../../openapi/base/create-request.interface';
import {PatchRequest} from '../../../openapi/base/patch-request.interface';
import {Observable, defer, tap} from 'rxjs';
import {finalize, switchMap, map} from 'rxjs/operators';
import { Pageable } from "../../../openapi/base/pageable.interface";
import {buildSpecString, EntitySpecification} from '../specification';
import {BaseDataSource} from '../base-data-source';

export class CrudDataSource<DTO extends BaseEntity, CREATE_REQ extends CreateRequest, PATCH_REQ extends PatchRequest> extends BaseDataSource {
    page = signal<Page<DTO> | undefined>(undefined);
    pageable = signal<Pageable>({
        page: 0,
        size: 50
    });
    specification = signal<EntitySpecification | undefined>(undefined);

    constructor(private service: PagedRestService<DTO, CREATE_REQ, PATCH_REQ>) {
        super();
    }

    getById(id: string): Observable<DTO> {
        return this.service.getById(id).pipe(this.track());
    }

    deleteById(id: string): Observable<void> {
        return this.service.delete(id).pipe(this.track());
    }

    updateById(id: string, request: PATCH_REQ): Observable<DTO> {
        return this.service.patch(id, request).pipe(this.track(), this.fetchAfter());
    }

    createById(id: string, request: CREATE_REQ): Observable<DTO> {
        return this.service.save(request).pipe(this.track(), this.fetchAfter());
    }

    fetch(): Observable<Page<DTO>> {
        let specString = '';

        const specification = this.specification();
        if (specification) {
            buildSpecString(specification)
        }

        return this.service.getAllPaged(this.pageable(), specString).pipe(this.track(), tap(response => {
            this.page.set(response);
        }));
    }

    protected fetchAfter<O>(): (source: Observable<O>) => Observable<O> {
        return (source: Observable<O>) => source.pipe(
            switchMap((value) => this.fetch().pipe(
                map(() => value)
            ))
        );
    }
}
