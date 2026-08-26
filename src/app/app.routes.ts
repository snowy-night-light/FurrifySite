import {Routes} from '@angular/router';
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
            },
            {
                path: ':libraryId/tags',
                loadComponent: () => import('./dashboard/tags/dashboard-tags.component').then(m => m.DashboardTagsComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'tab/tags',
                        pathMatch: 'full'
                    },
                    {
                        path: 'tab/tags',
                        loadComponent: () => import('./dashboard/tags/tabs/tag-tab/dashboard-tags-tab.component').then(m => m.DashboardTagsTabComponent)
                    },
                    {
                        path: 'tab/categories',
                        loadComponent: () => import('./dashboard/tags/tabs/tag-categories-tab/dashboard-tag-categories').then(m => m.DashboardTagCategories)
                    },
                    {
                        path: 'tab/aliases',
                        loadComponent: () => import('./dashboard/tags/tabs/tag-aliases-tab/dashboard-tag-aliases').then(m => m.DashboardTagAliases)
                    }
                ]
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
