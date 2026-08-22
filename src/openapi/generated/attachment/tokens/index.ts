import { InjectionToken } from "@angular/core";
import { HttpInterceptor, HttpContextToken } from "@angular/common/http";

/**
 * Injection token for the Attachment client base API path
 */
export const BASE_PATH_ATTACHMENT = new InjectionToken<string>('BASE_PATH_ATTACHMENT', {
    providedIn: 'root',
    factory: () => '/api', // Default fallback
});
/**
 * Injection token for the Attachment client HTTP interceptor instances
 */
export const HTTP_INTERCEPTORS_ATTACHMENT = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS_ATTACHMENT', {
    providedIn: 'root',
    factory: () => [], // Default empty array
});
/**
 * HttpContext token to identify requests belonging to the Attachment client
 */
export const CLIENT_CONTEXT_TOKEN_ATTACHMENT = new HttpContextToken<string>(() => 'Attachment');
