import { Routes } from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {canActivateAuthRole, canActivateNoAuth} from '../shared/guard/auth.guard';
import {NotFoundComponent} from './not-found/not-found.component';
import {DashboardComponent} from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
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
