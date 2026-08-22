import {computed, effect, inject, Injectable, signal} from '@angular/core';
import Keycloak from 'keycloak-js';
import {KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, ReadyArgs, typeEventArgs} from 'keycloak-angular';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    keycloakStatus = signal<string | undefined>(undefined);
    private readonly keycloak = inject(Keycloak);
    private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

    isAuthenticated = computed(() => this.authenticated());
    username = computed<string>(() => {
        if (!this.authenticated() || !this.keycloak.tokenParsed) return '?';
        return (this.keycloak.tokenParsed['preferred_username'] as string) || (this.keycloak.tokenParsed['name'] as string) || '?';
    });
    avatarUrl = computed<string | undefined>(() => {
        if (!this.authenticated() || !this.keycloak.tokenParsed) return undefined;
        return (this.keycloak.tokenParsed['picture'] as string) || (this.keycloak.tokenParsed['avatar'] as string);
    });
    userId = computed<string | undefined>(() => {
        if (!this.authenticated() || !this.keycloak.tokenParsed) return undefined;
        return this.keycloak.tokenParsed.sub;
    });

    private authenticated = signal<boolean>(false);

    constructor() {
        // If we are running Cypress tests
        if ((window as any).Cypress) {
            this.authenticated.set(true);
            this.keycloak.tokenParsed = {
                sub: '8619f350-7307-4c54-92dc-258177db8a44',
                preferred_username: 'testuser',
                name: 'Test User'
            };
            return;
        }

        effect(() => {
            const keycloakEvent = this.keycloakSignal();

            this.keycloakStatus.set(keycloakEvent.type);

            if (keycloakEvent.type === KeycloakEventType.Ready) {
                this.authenticated.set(typeEventArgs<ReadyArgs>(keycloakEvent.args));
            }

            if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
                this.authenticated.set(false);
            }
        });
    }

    login() {
        return this.keycloak.login();
    }

    getUserId(): string | undefined {
        if (!this.authenticated() || !this.keycloak.tokenParsed) return undefined;
        return this.keycloak.tokenParsed.sub;
    }

    logout() {
        return this.keycloak.logout();
    }
}
