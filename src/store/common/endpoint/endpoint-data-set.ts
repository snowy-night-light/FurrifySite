import {BaseDataSet} from '../base-data-set';
import {Observable} from 'rxjs';
import {EndpointDataSource} from './endpoint-data-source';

export class EndpointDataSet extends BaseDataSet {
    constructor(protected override dataSource: EndpointDataSource) {
        super(dataSource);
    }

    sendRequest<RESPONSE>(request: () => Observable<RESPONSE>): Observable<RESPONSE> {
        return this.dataSource.sendRequest<RESPONSE>(request).pipe(
            this.handleError()
        );
    }
}
