import { environment } from '../../src/environments/environment';

describe('Login page', () => {

    beforeEach(() => {
        cy.visit('/login');
    })

    it('should load login page', () => {
        cy.get('#login-btn').should('be.visible');
    });

    it('should navigate to Keycloak login', () => {
        cy.get('#login-btn').click();

        cy.url().should('include', environment.keycloakUrl);
    });
});
