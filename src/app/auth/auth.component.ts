import { Component } from '@angular/core';
import {AuthLoginComponent} from './auth-login/auth-login.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [
    AuthLoginComponent,
    NgOptimizedImage
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {}
