import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { ComponentRef } from '@angular/core';

describe('PaginationComponent', () => {
    let component: PaginationComponent<any>;
    let fixture: ComponentFixture<PaginationComponent<any>>;
    let componentRef: ComponentRef<PaginationComponent<any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PaginationComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        componentRef.setInput('pageData', undefined);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
