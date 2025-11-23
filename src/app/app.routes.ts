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
        loadComponent: () => import('./features/auth/register/register').then(c => c.Register)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(c => c.Login)
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then(c => c.Profile)
    },
    {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin-panel/admin-panel').then(c => c.AdminPanel)
    },
    {
      path: 'admin/products',
      loadComponent: () => import('./features/admin/product-management/product-management').then(c => c.ProductManagement)
    },
    {
        path: 'admin/products/new',
        loadComponent: () => import('./features/products/add-product/add-product').then(c => c.AddProduct)
      },

    {
        path: 'products/:id',
        loadComponent: () => import('./features/products/product-details/product-details').then(c => c.ProductDetails)
    },
    {
        path: 'add-product',
        loadComponent: () => import('./features/products/add-product/add-product').then(c => c.AddProduct)
    }
];
