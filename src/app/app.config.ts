import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideHttpClient, withInterceptors} from '@angular/common/http';

import {routes} from './app.routes';
import {
    provideKeycloak,
    withAutoRefreshToken,
    AutoRefreshTokenService,
    UserActivityService,
    INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    createInterceptorCondition,
    IncludeBearerTokenCondition,
    includeBearerTokenInterceptor
} from 'keycloak-angular';

import {environment} from '../environments/environment';
import {provideStorageClient} from '../openapi/generated/storage';
import {provideAttachmentClient} from '../openapi/generated/attachment';


const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: /^(https?:\/\/(localhost:8080|.*\.furrify\.site))(\/.*)?$/i,
    bearerPrefix: 'Bearer'
});


export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
        provideTranslateService({
            loader: provideTranslateHttpLoader({prefix: '/translations/', suffix: '.json'}),
            fallbackLang: 'en-US',
            lang: 'en-US'
        }),
        provideStorageClient({
            basePath: environment.gatewayUrl + '/storage',
        }),
        provideAttachmentClient({
            basePath: environment.gatewayUrl + '/attachments',
        }),
        provideKeycloak({
            config: {
                url: environment.keycloakUrl,
                realm: environment.keycloakRealm,
                clientId: environment.keycloakClientId
            },
            initOptions: {
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
            },
            features: [
                withAutoRefreshToken({
                    onInactivityTimeout: 'logout',
                    sessionTimeout: 1200000
                })
            ],
            providers: [
                AutoRefreshTokenService,
                UserActivityService
            ]
        }),
        {
            provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
            useValue: [urlCondition]
        },
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes)
    ]
};
