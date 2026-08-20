import { Component, inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import {NgOptimizedImage} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from '../../../shared/service/auth.service';

@Component({
  selector: 'app-auth-login',
    imports: [
        NgOptimizedImage,
        TranslatePipe
    ],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.css',
})
export class AuthLoginComponent {
  private readonly authService = inject(AuthService);

  login() {
    this.authService.login();
  }
}
