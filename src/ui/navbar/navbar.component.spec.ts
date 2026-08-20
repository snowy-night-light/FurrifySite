import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';

import { provideTranslateService } from '@ngx-translate/core';
import { AuthService } from '../../shared/service/auth.service';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

describe('Navbar', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
          provideRouter([]),
          provideTranslateService(),
          { provide: AuthService, useValue: { isAuthenticated: signal(false), username: signal('test'), avatarUrl: signal(''), logout: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
