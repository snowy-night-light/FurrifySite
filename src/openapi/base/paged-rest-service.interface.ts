import {
    RequestOptions
} from '../generated/attachments';
import {Observable} from 'rxjs';
import {HttpEvent, HttpResponse} from '@angular/common/http';
import {BaseEntity} from './base-entity.interface';
import { Page } from "./page.interface";
import {Pageable} from './pageable.interface';
import {CreateRequest} from './create-request.interface';
import {PatchRequest} from './patch-request.interface';

export interface PagedRestService<DTO extends BaseEntity, CREATE_REQ extends CreateRequest, PATCH_REQ extends PatchRequest> {
    getAllPaged(pageable: Pageable, spec?: string, observe?: 'body', options?: RequestOptions<'json'>): Observable<Page<DTO>>;
    getAllPaged(pageable: Pageable, spec?: string, observe?: 'response', options?: RequestOptions<'json'>): Observable<HttpResponse<Page<DTO>>>;
    getAllPaged(pageable: Pageable, spec?: string, observe?: 'events', options?: RequestOptions<'json'>): Observable<HttpEvent<Page<DTO>>>;
    getAllPaged(pageable: Pageable, spec?: string, observe?: 'body' | 'events' | 'response', options?: RequestOptions<'arraybuffer' | 'blob' | 'json' | 'text'>): Observable<any>;

    save(requestBody: CREATE_REQ, observe?: 'body', options?: RequestOptions<'blob'>): Observable<DTO>;
    save(requestBody: CREATE_REQ, observe?: 'response', options?: RequestOptions<'blob'>): Observable<HttpResponse<DTO>>;
    save(requestBody: CREATE_REQ, observe?: 'events', options?: RequestOptions<'blob'>): Observable<HttpEvent<DTO>>;
    save(requestBody: CREATE_REQ, observe?: 'body' | 'events' | 'response', options?: RequestOptions<'arraybuffer' | 'blob' | 'json' | 'text'>): Observable<any>;

    getById(id: string, observe?: 'body', options?: RequestOptions<'json'>): Observable<DTO>;
    getById(id: string, observe?: 'response', options?: RequestOptions<'json'>): Observable<HttpResponse<DTO>>;
    getById(id: string, observe?: 'events', options?: RequestOptions<'json'>): Observable<HttpEvent<DTO>>;
    getById(id: string, observe?: 'body' | 'events' | 'response', options?: RequestOptions<'arraybuffer' | 'blob' | 'json' | 'text'>): Observable<any>;

    patch(id: string, requestBody: PATCH_REQ, observe?: 'body', options?: RequestOptions<'blob'>): Observable<DTO>;
    patch(id: string, requestBody: PATCH_REQ, observe?: 'response', options?: RequestOptions<'blob'>): Observable<HttpResponse<DTO>>;
    patch(id: string, requestBody: PATCH_REQ, observe?: 'events', options?: RequestOptions<'blob'>): Observable<HttpEvent<DTO>>;
    patch(id: string, requestBody: PATCH_REQ, observe?: 'body' | 'events' | 'response', options?: RequestOptions<'arraybuffer' | 'blob' | 'json' | 'text'>): Observable<any>;

    delete(id: string, observe?: 'body', options?: RequestOptions<'json'>): Observable<any>;
    delete(id: string, observe?: 'response', options?: RequestOptions<'json'>): Observable<HttpResponse<any>>;
    delete(id: string, observe?: 'events', options?: RequestOptions<'json'>): Observable<HttpEvent<any>>;
    delete(id: string, observe?: 'body' | 'events' | 'response', options?: RequestOptions<'arraybuffer' | 'blob' | 'json' | 'text'>): Observable<any>;
}
