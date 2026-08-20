import { InjectionToken } from "@angular/core";
import { HttpInterceptor, HttpContextToken } from "@angular/common/http";

/**
 * Injection token for the Attachments client base API path
 */
export const BASE_PATH_ATTACHMENTS = new InjectionToken<string>('BASE_PATH_ATTACHMENTS', {
    providedIn: 'root',
    factory: () => '/api', // Default fallback
});
/**
 * Injection token for the Attachments client HTTP interceptor instances
 */
export const HTTP_INTERCEPTORS_ATTACHMENTS = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS_ATTACHMENTS', {
    providedIn: 'root',
    factory: () => [], // Default empty array
});
/**
 * HttpContext token to identify requests belonging to the Attachments client
 */
export const CLIENT_CONTEXT_TOKEN_ATTACHMENTS = new HttpContextToken<string>(() => 'Attachments');
