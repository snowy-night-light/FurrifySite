import {BaseDataSet} from '../base-data-set';
import {Observable} from 'rxjs';
import {EndpointDataSource} from './endpoint-data-source';
import {UiToastService} from '../../../ui/core/service/ui-toast.service';

export class EndpointDataSet extends BaseDataSet {
    constructor(protected override dataSource: EndpointDataSource, toastService: UiToastService) {
        super(dataSource, toastService);
    }

    sendRequest<RESPONSE>(request: () => Observable<RESPONSE>): Observable<RESPONSE> {
        return this.dataSource.sendRequest<RESPONSE>(request).pipe(
            this.handleError()
        );
    }
}
