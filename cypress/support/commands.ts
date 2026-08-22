declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(): Chainable<any>;
  }
}

Cypress.Commands.add('login', () => {
  cy.log('Bypassing Keycloak authentication for E2E tests (Mocked via AuthService)');
});
