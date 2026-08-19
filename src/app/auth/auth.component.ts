import { Component } from '@angular/core';
import {AuthLoginComponent} from './auth-login/auth-login.component';

@Component({
  selector: 'app-auth',
  imports: [
    AuthLoginComponent
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {}
