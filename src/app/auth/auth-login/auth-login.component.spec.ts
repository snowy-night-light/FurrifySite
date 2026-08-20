import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLoginComponent } from './auth-login.component';

import { provideTranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../shared/service/auth.service';

describe('AuthLogin', () => {
  let component: AuthLoginComponent;
  let fixture: ComponentFixture<AuthLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLoginComponent],
      providers: [
          provideTranslateService(),
          { provide: AuthService, useValue: { login: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
