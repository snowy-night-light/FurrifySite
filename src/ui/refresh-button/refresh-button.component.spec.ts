import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefreshButtonComponent } from './refresh-button.component';
import { ComponentRef } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';

describe('RefreshButtonComponent', () => {
    let component: RefreshButtonComponent;
    let fixture: ComponentFixture<RefreshButtonComponent>;
    let componentRef: ComponentRef<RefreshButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RefreshButtonComponent],
            providers: [provideTranslateService()]
        }).compileComponents();

        fixture = TestBed.createComponent(RefreshButtonComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput('isRefreshing', false);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
