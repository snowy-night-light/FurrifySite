import { Routes } from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {canActivateAuthRole, canActivateNoAuth} from '../shared/guard/auth.guard';
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [canActivateAuthRole],
    data: {
      redirect: '/login'
    }
  },
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [canActivateNoAuth],
    data: {
      redirect: '/'
    }
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
