describe('Dashboard tag aliases', () => {

    beforeEach(() => {
        cy.login();

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags/aliases**',
            },
            { fixture: 'dashboard/get-tag-aliases.json' }
        ).as('getTagAliases');

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/libraries**',
            },
            { fixture: 'dashboard/get-libraries.json' }
        ).as('getLibraries');

        cy.visit('/dashboard/7f000101-a02b-16c6-81a0-2b504de20001/tags/tab/aliases');

        cy.wait('@getTagAliases');
        cy.wait('@getLibraries');
    })

    it("Should load alias items", () => {
        cy.get('.alias-card').should('have.length.at.least', 1);
    });

    it("Should refresh on refresh btn click", () => {
        cy.get('.refresh-box .refresh-btn').click();
        cy.wait('@getTagAliases');
    });

    it("Should remove alias on trash icon clicked", () => {
        cy.intercept(
            {
                method: 'DELETE',
                url: '**storage/v1/tags/aliases/7f000101-a02f-109d-81a0-2f00b5390000**',
            },
            { statusCode: 200 }
        ).as('removeAlias');

        cy.get('.alias-card').eq(0).find('.remove-icon').click();

        cy.wait('@removeAlias');
        cy.wait('@getTagAliases');
    });

    it("Should search aliases by search bar input text", () => {
        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags/aliases?spec=KCgodGFyZ2V0VGFnLmxpYnJhcnkuaWQgPSA3ZjAwMDEwMS1hMDJiLTE2YzYtODFhMC0yYjUwNGRlMjAwMDEpIHx8ICh0YXJnZXRUYWcubGlicmFyeSA9IG51bGwpKSAmJiAoYWxpYXMgbGlrZV4gJWFwcGxlJSkp**',
            },
            { fixture: 'dashboard/get-tag-aliases-by-spec.json' }
        ).as('getTagAliasesBySpec');

        cy.get('.search-bar').find('input').type('apple');
        cy.wait('@getTagAliasesBySpec');

        cy.get('.alias-card').should('have.length', 1);
    });

    it("should open edit modal on pencil icon clicked", () => {
        cy.get('.alias-card').eq(0).find('.edit-icon').click();

        cy.get('app-dashboard-alias-edit').should('be.visible');
        cy.get('app-dashboard-alias-edit input').eq(0).should('be.visible');
        cy.get('ui-modal-dialog .modal-save-btn').should('exist');
    });

    it("should open edit modal on pencil icon clicked and successfully edit", () => {
        cy.get('.alias-card').eq(0).find('.edit-icon').click();

        cy.get('app-dashboard-alias-edit input').eq(0).clear();
        cy.get('app-dashboard-alias-edit input').eq(0).type('updated alias');

        cy.intercept(
            {
                method: 'PATCH',
                url: '**storage/v1/tags/aliases/7f000101-a02f-109d-81a0-2f00b5390000**',
            },
            { statusCode: 200, fixture: 'dashboard/get-updated-tag-alias.json' }
        ).as('patchAlias');

        cy.get('ui-modal-dialog .modal-save-btn').click();

        cy.wait('@patchAlias');
        cy.wait('@getTagAliases');
    });

    it("should open create alias modal on add alias clicked and successfully create alias", () => {
        cy.get('.add-alias-btn').click();

        cy.get('app-dashboard-alias-edit input').eq(0).clear();
        cy.get('app-dashboard-alias-edit input').eq(0).type('new alias');

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags**',
            },
            { statusCode: 200, fixture: 'dashboard/get-user-tags.json' }
        ).as('getUserTags');

        cy.get('app-dashboard-alias-edit input').eq(1).type('tag search');
        cy.wait('@getUserTags');
        cy.get('app-dashboard-alias-edit ui-dynamic-dropdown').find('button').eq(0).click();

        cy.intercept(
            {
                method: 'POST',
                url: '**/storage/v1/tags/aliases**',
            },
            { statusCode: 200, fixture: 'dashboard/create-tag-alias.json' }
        ).as('createTagAlias');

        cy.get('ui-modal-dialog .modal-save-btn').click();

        cy.wait('@createTagAlias');
        cy.wait('@getTagAliases');
    });
});
