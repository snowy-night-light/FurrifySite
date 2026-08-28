describe('Dashboard tag categories', () => {

    beforeEach(() => {
        cy.login();

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags/categories**',
            },
            { fixture: 'dashboard/get-user-tag-categories.json' }
        ).as('getUserTagCategories');

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/libraries**',
            },
            { fixture: 'dashboard/get-libraries.json' }
        ).as('getLibraries');

        cy.visit('/dashboard/7f000101-a02b-16c6-81a0-2b504de20001/tags/tab/categories');

        cy.wait('@getUserTagCategories');
        cy.wait('@getLibraries');
    })

    it("Should load category items", () => {
        cy.get('.category-card').should('have.length.at.least', 1);
    });

    it("Should refresh on refresh btn click", () => {
        cy.get('.refresh-box .refresh-btn').click();
        cy.wait('@getUserTagCategories');
    });

    it("Should remove category on trash icon clicked", () => {
        cy.intercept(
            {
                method: 'DELETE',
                url: '**/storage/v1/tags/categories/7f000101-a019-1056-81a0-1943319d0007**',
            },
            { statusCode: 200 }
        ).as('removeCategory');

        cy.get('.category-card').eq(0).find('.remove-icon').click();

        cy.wait('@removeCategory');
        cy.wait('@getUserTagCategories');
    });

    it("should open edit modal on pencil icon clicked", () => {
        cy.get('.category-card').eq(0).find('.edit-icon').click();

        cy.get('app-dashboard-category-edit').should('be.visible');
        cy.get('app-dashboard-category-edit input[type="text"]').eq(0).should('be.visible');
        cy.get('app-dashboard-category-edit input[type="color"]').should('be.visible');
        cy.get('ui-modal-dialog .modal-save-btn').should('exist');
    });

    it("should open edit modal on pencil icon clicked and successfully edit", () => {
        cy.get('.category-card').eq(0).find('.edit-icon').click();

        cy.get('app-dashboard-category-edit input[type="text"]').eq(0).clear();
        cy.get('app-dashboard-category-edit input[type="text"]').eq(0).type('updated category');

        // Test editing color via the text input
        cy.get('app-dashboard-category-edit input[type="text"]').eq(1).clear();
        cy.get('app-dashboard-category-edit input[type="text"]').eq(1).type('#00ff00');

        cy.intercept(
            {
                method: 'PATCH',
                url: '**/storage/v1/tags/categories/7f000101-a019-1056-81a0-1943319d0007**',
            },
            { statusCode: 200, fixture: 'dashboard/get-updated-tag-category.json' }
        ).as('patchCategory');

        cy.get('ui-modal-dialog .modal-save-btn').click();

        cy.wait('@patchCategory');
        cy.wait('@getUserTagCategories');
    });

    it("should open create category modal on add category clicked and successfully create category via color picker", () => {
        cy.get('.add-category-btn').click();

        cy.get('app-dashboard-category-edit input[type="text"]').eq(0).clear();
        cy.get('app-dashboard-category-edit input[type="text"]').eq(0).type('new category');

        cy.get('app-dashboard-category-edit input[type="color"]')
            .invoke('val', '#ff0000')
            .trigger('input');

        cy.get('app-dashboard-category-edit input[type="text"]').eq(1).should('have.value', '#ff0000');

        cy.intercept(
            {
                method: 'POST',
                url: '**/storage/v1/tags/categories**',
            },
            { statusCode: 200, fixture: 'dashboard/create-tag-category.json' }
        ).as('createTagCategory');

        cy.get('ui-modal-dialog .modal-save-btn').click();

        cy.wait('@createTagCategory');
        cy.wait('@getUserTagCategories');
    });
});
