import { Component, signal } from '@angular/core';
import {InputFieldComponent} from '../../../ui/input-field/input-field.component';
import {LabelComponent} from '../../../ui/label.component/label.component';
import {email, form, FormField, required} from '@angular/forms/signals';

export interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-auth-login',
    imports: [
        InputFieldComponent,
        LabelComponent,
        FormField,
    ],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.css',
})
export class AuthLoginComponent {

  loginModel = signal<LoginData>({ email: '', password: '' });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    email(schemaPath.email, {message: 'Enter a valid email address'});
    required(schemaPath.password, {message: 'Password is required'});
  });

    onSubmit(event: SubmitEvent) {
    console.log(this.loginForm().value());
    event.preventDefault();
  }
}
