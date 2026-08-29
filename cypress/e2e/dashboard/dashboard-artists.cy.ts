describe('Dashboard artists', () => {

    beforeEach(() => {
        cy.login();

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/artists**',
            },
            { fixture: 'dashboard/get-user-artists.json' }
        ).as('getUserArtists');

        cy.intercept(
            {
                method: 'GET',
                url: '**/attachments/v1/files?**'
            },
            { fixture: 'dashboard/empty-page.json' }
        );

        cy.intercept(
            {
                method: 'GET',
                url: '**/attachments/v1/files/*'
            },
            { statusCode: 200, body: { id: 'dummy', thumbnailUri: '/dummy-thumbnail.jpg' } }
        );

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/media?**'
            },
            { fixture: 'dashboard/empty-page.json' }
        );

        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/libraries**',
            },
            { fixture: 'dashboard/get-libraries.json' }
        ).as('getLibraries');

        cy.visit('/dashboard/7f000101-a02b-16c6-81a0-2b504de20001/artists');

        cy.wait('@getUserArtists');
        cy.wait('@getLibraries');
    })

    it("Should load artist items", () => {
        cy.get('.artist-card').should('have.length', 2)
    });

    it("Should refresh on refresh btn click", () => {
        cy.get('.refresh-box .refresh-btn').click();
        cy.wait('@getUserArtists');
    });

    it("Should remove artist on trash icon clicked", () => {
        cy.intercept(
            {
                method: 'DELETE',
                url: '**/storage/v1/artists/*',
            },
            { statusCode: 200 }
        ).as('removeArtist');

        cy.get('.artist-card').eq(0).find('.delete-icon').click();

        cy.wait('@removeArtist');
        cy.wait('@getUserArtists');
    });

    it("Should search artists by search bar input text", () => {
        cy.intercept(
            {
                method: 'GET',
                url: '**/storage/v1/artists?spec=KCgobGlicmFyeS5pZCA9IDdmMDAwMTAxLWEwMmItMTZjNi04MWEwLTJiNTA0ZGUyMDAwMSkgfHwgKGxpYnJhcnkgPSBudWxsKSkgJiYgKG5pY2tuYW1lcy5uaWNrbmFtZSBsaWtlXiAlc25vdyUpKQ==**',
            },
            { fixture: 'dashboard/get-user-artists-by-spec.json' }
        ).as('getUserArtists');

        cy.get('.search-bar').find('input').type('snow');
        cy.wait('@getUserArtists');

        cy.get('.artist-card').should('have.length', 1);
    });

    it("should open edit modal on pencil icon clicked", () => {
        cy.get('.artist-card').eq(0).find('.edit-icon').click();

        cy.get('app-dashboard-artist-edit').should('be.visible');

        cy.get('app-dashboard-artist-edit input').eq(1).should('have.value', 'Snowy');
        cy.get('.edit-artist-dialog > dialog > .modal-box > .modal-action .modal-save-btn').should('be.enabled');
    });


    it("should open edit modal on pencil icon clicked and successfully edit with avatar and nicknames", () => {
        cy.get('.artist-card').eq(0).find('.edit-icon').click();

        cy.get('app-dashboard-artist-edit input[type="text"]').eq(0).clear();
        cy.get('app-dashboard-artist-edit input[type="text"]').eq(0).type('applejack2');

        cy.get('app-dashboard-artist-edit input[type="text"]').eq(1).type('new_nickname');
        cy.get('ui-item-list-form button[type="submit"]').click();

        cy.get('ui-item-list-form .badge').should('have.length.at.least', 1);
        cy.get('ui-item-list-form .badge').eq(0).find('button').click();

        cy.get('app-dashboard-artist-edit input[type="file"]').selectFile('cypress/fixtures/dashboard/get-user-artists.json', { force: true });

        cy.intercept(
            {
                method: 'POST',
                url: '**/attachments/v1/files**',
            },
            { statusCode: 200, fixture: 'dashboard/get-user-artists.json' }
        ).as('createAttachment');

        cy.intercept(
            {
                method: 'POST',
                url: '**/storage/v1/media**',
            },
            { statusCode: 200, fixture: 'dashboard/get-user-artists.json' }
        ).as('createMedia');

        cy.intercept(
            {
                method: 'PATCH',
                url: '**/storage/v1/artists/*',
            },
            { statusCode: 200, fixture: 'dashboard/get-updated-artist.json' }
        ).as('patchArtist');

        cy.get('.edit-artist-dialog > dialog > .modal-box > .modal-action .modal-save-btn').click();

        cy.wait('@createAttachment');
        cy.wait('@createMedia');
        cy.wait('@patchArtist');
        cy.wait('@getUserArtists');
    });

    it("should open edit modal on add artist clicked and successfully create artist with avatar and nicknames", () => {
        cy.get('.add-artist-btn').click();

        cy.get('app-dashboard-artist-edit input[type="text"]').eq(0).clear();
        cy.get('app-dashboard-artist-edit input[type="text"]').eq(0).type('applejack2');

        cy.get('app-dashboard-artist-edit input[type="text"]').eq(1).type('new_nickname');
        cy.get('ui-item-list-form button[type="submit"]').click();

        cy.get('ui-item-list-form .badge').should('have.length', 1);

        cy.get('app-dashboard-artist-edit input[type="file"]').selectFile('cypress/fixtures/dashboard/get-user-artists.json', { force: true });

        cy.intercept(
            {
                method: 'POST',
                url: '**/attachments/v1/files**',
            },
            { statusCode: 200, fixture: 'dashboard/get-user-artists.json' }
        ).as('createAttachment');

        cy.intercept(
            {
                method: 'POST',
                url: '**/storage/v1/media**',
            },
            { statusCode: 200, fixture: 'dashboard/get-user-artists.json' }
        ).as('createMedia');

        cy.intercept(
            {
                method: 'POST',
                url: '**/storage/v1/artists**',
            },
            { statusCode: 200, fixture: 'dashboard/get-created-artist.json' }
        ).as('createArtist');

        cy.get('.edit-artist-dialog > dialog > .modal-box > .modal-action .modal-save-btn').click();

        cy.wait('@createAttachment');
        cy.wait('@createMedia');
        cy.wait('@createArtist');
        cy.wait('@getUserArtists');
    });
});
