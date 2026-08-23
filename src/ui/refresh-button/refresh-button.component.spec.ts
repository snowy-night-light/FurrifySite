import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RefreshButtonComponent } from './refresh-button.component';
import { ComponentRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('RefreshButtonComponent', () => {
    let component: RefreshButtonComponent;
    let fixture: ComponentFixture<RefreshButtonComponent>;
    let componentRef: ComponentRef<RefreshButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RefreshButtonComponent, TranslateModule.forRoot()]
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
