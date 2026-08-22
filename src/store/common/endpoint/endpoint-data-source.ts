import {BaseDataSource} from '../base-data-source';
import {Observable} from 'rxjs';

export class EndpointDataSource extends BaseDataSource {
    sendRequest<RESPONSE>(request: () => Observable<RESPONSE>): Observable<RESPONSE> {
        return request().pipe(this.track());
    }
}
