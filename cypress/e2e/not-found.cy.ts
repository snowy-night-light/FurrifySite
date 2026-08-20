describe('Not found page', () => {

    beforeEach(() => {
        cy.visit('/' + self.crypto.randomUUID().toString());
    })

    it('should show not found page', () => {
        cy.get('app-not-found').should('be.visible');
    });
});
