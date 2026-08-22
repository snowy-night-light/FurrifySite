import { Observable } from 'rxjs';
import {BaseEntity} from '../../../openapi/base/base-entity.interface';
import {CreateRequest} from '../../../openapi/base/create-request.interface';
import {PatchRequest} from '../../../openapi/base/patch-request.interface';
import {CrudDataSource} from './crud-data-source';
import {UiToastService} from '../../../ui/core/service/ui-toast.service';
import {Page} from '../../../openapi/base/page.interface';
import {BaseDataSet} from '../base-data-set';

export class CrudDataSet<DTO extends BaseEntity, CREATE_REQ extends CreateRequest, PATCH_REQ extends PatchRequest> extends BaseDataSet {

    constructor(protected override dataSource: CrudDataSource<DTO, CREATE_REQ, PATCH_REQ>, toastService: UiToastService) {
        super(dataSource, toastService);
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

    createById(id: string, request: CREATE_REQ): Observable<DTO> {
        return this.dataSource.createById(id, request).pipe(
            this.handleError('store.dataset.errors.createFailedTitle')
        );
    }

    fetch(): Observable<Page<DTO>> {
        return this.dataSource.fetch().pipe(
            this.handleError('store.dataset.errors.fetchFailedTitle')
        );
    }
}
