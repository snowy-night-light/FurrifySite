import { TestBed } from '@angular/core/testing';
import { App } from './app';

import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { AuthService } from '../shared/service/auth.service';
import { signal } from '@angular/core';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
          provideRouter([]),
          provideTranslateService(),
          { provide: AuthService, useValue: { isAuthenticated: signal(false), username: signal('test'), avatarUrl: signal(''), logout: () => {} } }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
