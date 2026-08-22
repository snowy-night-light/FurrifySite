import { Routes } from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {canActivateAuthRole, canActivateNoAuth} from '../shared/guard/auth.guard';
import {NotFoundComponent} from './not-found/not-found.component';
import {DashboardComponent} from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canActivateAuthRole],
    data: {
      redirect: '/login'
    },
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadComponent: () => import('./dashboard/overview/dashboard-overview.component').then(m => m.DashboardOverviewComponent)
      }
    ]
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
