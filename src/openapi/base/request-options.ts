import {HttpContext, HttpHeaders} from '@angular/common/http';

export interface RequestOptions<TResponseType extends 'arraybuffer' | 'blob' | 'json' | 'text'> {
    headers?: HttpHeaders;
    reportProgress?: boolean;
    responseType?: TResponseType;
    withCredentials?: boolean;
    context?: HttpContext;
}
