import { Component } from '@angular/core';
import {InputFieldComponent} from '../../../ui/input-field/input-field.component';
import {LabelComponent} from '../../../ui/label.component/label.component';

@Component({
  selector: 'app-auth-login',
    imports: [
        InputFieldComponent,
        LabelComponent
    ],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.css',
})
export class AuthLoginComponent {}
