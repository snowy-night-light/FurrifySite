import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastQueueComponent } from './toast-queue.component';

describe('ToastQueueComponent', () => {
    let component: ToastQueueComponent;
    let fixture: ComponentFixture<ToastQueueComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToastQueueComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ToastQueueComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
