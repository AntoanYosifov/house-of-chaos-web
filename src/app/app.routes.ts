import {Routes} from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home').then(c => c.Home)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/components/register/register').then(c => c.Register)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login').then(c => c.Login)
    },
    {
        path: 'logout',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'products',
        loadComponent: () => import('./features/products/product-item/product-item').then(c => c.ProductItem)
    }
];
