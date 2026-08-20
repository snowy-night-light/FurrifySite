import { Component } from '@angular/core';
import {AuthLoginComponent} from './auth-login/auth-login.component';
import { NgOptimizedImage } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-auth',
    imports: [
        AuthLoginComponent,
        NgOptimizedImage,
        TranslatePipe
    ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {}
