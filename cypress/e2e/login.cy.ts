import { environment } from '../../src/environments/environment';

describe('FurrifySite', () => {

    beforeEach(() => {
        cy.visit('/login');
    })

    it('should load login page', () => {
        cy.get('#login-btn').should('be.visible');
    });

    it('should navigate to Keycloak login', () => {
        cy.get('#login-btn').click();
        
        // Assert that the browser navigated to the Keycloak URL
        cy.url().should('include', environment.keycloakUrl);
    });
});
