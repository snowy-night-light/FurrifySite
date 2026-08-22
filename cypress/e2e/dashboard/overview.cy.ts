describe('Overview page', () => {

    beforeEach(() => {
        cy.login();


        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/user/**/statistics',
            },
            { fixture: 'dashboard/get-user-statistics.json' }
        ).as('getUserStatistics');

        cy.visit('/dashboard/overview');

        cy.wait('@getUserStatistics');
    })

    it("Loads overview tab", () => {
        cy.get('#artistsCount').should('contain.text', '2');
        cy.get('#postsCount').should('contain.text', '5');
        cy.get('#tagsCount').should('contain.text', '4');
        cy.get('#collectionsCount').should('contain.text', '3');
        cy.get('#librariesCount').should('contain.text', '6');
        cy.get('#growthChart').should('be.visible');
        cy.get('#mediaTypesChart').should('be.visible');
    });

    it("Should refresh on refresh icon clicked", () => {
        cy.get('#refreshStatisticsBtn').click();
        cy.wait('@getUserStatistics');
    });
});
