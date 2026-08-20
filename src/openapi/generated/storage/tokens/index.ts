import { InjectionToken } from "@angular/core";
import { HttpInterceptor, HttpContextToken } from "@angular/common/http";

/**
 * Injection token for the Storage client base API path
 */
export const BASE_PATH_STORAGE = new InjectionToken<string>('BASE_PATH_STORAGE', {
    providedIn: 'root',
    factory: () => '/api', // Default fallback
});
/**
 * Injection token for the Storage client HTTP interceptor instances
 */
export const HTTP_INTERCEPTORS_STORAGE = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS_STORAGE', {
    providedIn: 'root',
    factory: () => [], // Default empty array
});
/**
 * HttpContext token to identify requests belonging to the Storage client
 */
export const CLIENT_CONTEXT_TOKEN_STORAGE = new HttpContextToken<string>(() => 'Storage');
