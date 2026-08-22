import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOverviewComponent } from './dashboard-overview.component';

import { provideTranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../shared/service/auth.service';
import { UserStatisticsV1RestControllerService } from '../../../openapi/generated/storage';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

import { of } from 'rxjs';

describe('OverviewComponent', () => {
  let component: DashboardOverviewComponent;
  let fixture: ComponentFixture<DashboardOverviewComponent>;

  beforeEach(async () => {
    (window as any).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    await TestBed.configureTestingModule({
      imports: [DashboardOverviewComponent],
      providers: [
          provideHttpClient(),
          provideTranslateService(),
          { provide: AuthService, useValue: { getUserId: () => 'test-id' } },
          { provide: UserStatisticsV1RestControllerService, useValue: { getUserStatistics: () => of({}) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
