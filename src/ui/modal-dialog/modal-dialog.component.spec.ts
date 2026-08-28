import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialogComponent } from './modal-dialog.component';

import { provideTranslateService } from '@ngx-translate/core';

describe('ModalDialogComponent', () => {
    let component: ModalDialogComponent<any, any>;
    let fixture: ComponentFixture<ModalDialogComponent<any, any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalDialogComponent],
            providers: [provideTranslateService()]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
