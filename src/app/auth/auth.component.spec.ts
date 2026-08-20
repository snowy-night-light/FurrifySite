import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';

import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';
import { signal } from '@angular/core';

describe('Auth', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [
          provideRouter([]),
          provideTranslateService(),
          { provide: AuthService, useValue: { isAuthenticated: signal(false), username: signal('test'), avatarUrl: signal(''), logout: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
