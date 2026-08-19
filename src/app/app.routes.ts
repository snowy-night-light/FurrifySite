import { Routes } from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {canActivateAuthRole} from '../shared/guard/auth.guard';
import {HomeComponent} from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [canActivateAuthRole],
    data: {
      redirect: 'login'
    }
  },
  {
    path: 'login',
    component: AuthComponent,
  }
];
