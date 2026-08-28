describe('Dashboard tags', () => {

    beforeEach(() => {
        cy.login();

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags**',
            },
            { fixture: 'dashboard/get-user-tags.json' }
        ).as('getUserTags');

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/libraries**',
            },
            { fixture: 'dashboard/get-libraries.json' }
        ).as('getLibraries');

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags/aliases**',
            },
            { fixture: 'dashboard/get-tag-aliases.json' }
        ).as('getTagAliases');

        cy.visit('/dashboard/7f000101-a02b-16c6-81a0-2b504de20001/tags/tab/tags');

        cy.wait('@getUserTags');
        cy.wait('@getLibraries');
    })

    it("Should load tag items", () => {
        cy.get('.tag-card').should('have.length', 6)
    });

    it("Should refresh on refresh btn click", () => {
        cy.get('.refresh-box .refresh-btn').click();
        cy.wait('@getUserTags');
    });

    it("Should remove tag on trash icon clicked", () => {
        cy.intercept(
            {
                method: 'DELETE',
                url: '**/storage/v1/tags/7f000101-a019-1056-81a0-19418a100001**',
            },
            { statusCode: 200 }
        ).as('removeTag');

        cy.get('.tag-card').eq(0).find('.remove-icon').click();

        cy.wait('@removeTag');
        cy.wait('@getUserTags');
    });

    it("Should search tags by search bar input text", () => {
        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags?spec=KCgobGlicmFyeS5pZCA9IDdmMDAwMTAxLWEwMmItMTZjNi04MWEwLTJiNTA0ZGUyMDAwMSkgfHwgKGxpYnJhcnkgPSBudWxsKSkgJiYgKG5hbWUgbGlrZV4gJXR3aWxpZ2h0JSkp**',
            },
            { fixture: 'dashboard/get-user-tags-by-spec.json' }
        ).as('getUserTags');

        cy.get('.search-bar').find('input').type('twilight');
        cy.wait('@getUserTags');

        cy.get('.tag-card').should('have.length', 1);
    });

    it("should open edit modal on pencil icon clicked", () => {
        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags/aliases**',
            },
            { statusCode: 200, fixture: 'dashboard/get-tag-empty-aliases.json' }
        ).as('getEmptyTagAliases');

        cy.get('.tag-card').eq(0).find('.edit-icon').click();

        cy.wait('@getEmptyTagAliases');

        cy.get('app-dashboard-tag-edit').should('be.visible');

        cy.get('app-dashboard-tag-edit input').eq(0).should('have.value', 'applejack');
        cy.get('app-dashboard-tag-edit input').eq(1).should('have.value', 'Character');
        cy.get('app-dashboard-tag-edit .tag-aliases .no-aliases-text').should('be.visible');
        cy.get('.edit-tag-dialog > dialog > .modal-box > .modal-action .modal-save-btn').should('be.enabled');
    });


    it("should open edit modal on pencil icon clicked and successfully edit", () => {
        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags/aliases**',
            },
            { statusCode: 200, fixture: 'dashboard/get-tag-empty-aliases.json' }
        ).as('getEmptyTagAliases');

        cy.get('.tag-card').eq(0).find('.edit-icon').click();

        cy.wait('@getEmptyTagAliases');

        cy.get('app-dashboard-tag-edit input').eq(0).clear();
        cy.get('app-dashboard-tag-edit input').eq(0).type('applejack2');

        cy.intercept(
            {
                method: 'PATCH',
                url: '**/storage/v1/tags/7f000101-a019-1056-81a0-19418a100001**',
            },
            { statusCode: 200, fixture: 'dashboard/get-updated-tag.json' }
        ).as('patchTag');

        cy.get('.edit-tag-dialog > dialog > .modal-box > .modal-action .modal-save-btn').click();

        cy.wait('@patchTag');
        cy.wait('@getUserTags');
    });

    it("should open edit modal on pencil icon clicked with aliases list", () => {
        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags/aliases**',
            },
            { statusCode: 200, fixture: 'dashboard/get-tag-aliases.json' }
        ).as('getTagAliases');

        cy.get('.tag-card').eq(1).find('.edit-icon').click();

        cy.wait('@getTagAliases');

        cy.get('app-dashboard-tag-edit').should('be.visible');

        cy.get('app-dashboard-tag-edit .tag-aliases .alias-text').should('have.length', 3);
    });

    it("should open edit modal on pencil icon clicked and open create alias modal and create alias", () => {
        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags/aliases**',
            },
            { statusCode: 200, fixture: 'dashboard/get-tag-aliases.json' }
        ).as('getTagAliases');

        let requestCount = 0;

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags/aliases**',
            },
            (req) => {
                if (requestCount === 0) {
                    requestCount += 1;
                    req.reply({
                        fixture: 'dashboard/get-tag-aliases.json',
                    });
                } else {
                    req.reply({
                        fixture: 'dashboard/get-tag-aliases-with-new-one.json',
                    });
                }
            }
        ).as('getTagAliases');

        cy.get('.tag-card').eq(1).find('.edit-icon').click();

        cy.wait('@getTagAliases');

        cy.get('app-dashboard-tag-edit .add-alias-btn').click();
        cy.get('app-dashboard-tag-edit app-dashboard-alias-edit').should('be.visible');
        cy.get('app-dashboard-tag-edit app-dashboard-alias-edit input').eq(0).type('test');

        cy.intercept(
            {
                method: 'POST',
                url: '**/storage/v1/tags/aliases**',
            },
            { statusCode: 200, fixture: 'dashboard/create-tag-alias.json' }
        ).as('createTagAlias');

        cy.get('app-dashboard-tag-edit ui-modal-dialog .modal-save-btn').click();

        cy.wait('@createTagAlias');
        cy.wait('@getTagAliases');
    });


    it("should open edit modal on add tag clicked and successfully create tag", () => {
        cy.get('.add-tag-btn').click();

        cy.get('app-dashboard-tag-edit input').eq(0).clear();
        cy.get('app-dashboard-tag-edit input').eq(0).type('applejack2');

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/tags/categories**',
            },
            { statusCode: 200, fixture: 'dashboard/get-user-tag-categories.json' }
        ).as('getUserTagCategories');

        cy.get('app-dashboard-tag-edit input').eq(1).type('Character');

        cy.wait('@getUserTagCategories');

        cy.get('app-dashboard-tag-edit ui-dynamic-dropdown').find('button').eq(0).click();

        cy.intercept(
            {
                method: 'POST',
                url: '**/storage/v1/tags**',
            },
            { statusCode: 200, fixture: 'dashboard/get-created-tag.json' }
        ).as('createTag');

        cy.get('.edit-tag-dialog > dialog > .modal-box > .modal-action .modal-save-btn').click();

        cy.wait('@createTag');
        cy.wait('@getUserTags');
    });
});
