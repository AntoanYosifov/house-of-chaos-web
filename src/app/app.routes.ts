import {Routes} from '@angular/router';
import {adminGuard} from './core/guards/admin-guard';

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
        loadComponent: () => import('./features/admin/admin-panel/admin-panel').then(c => c.AdminPanel),
        canActivate: [adminGuard]
    },
    {
      path: 'admin/products',
      loadComponent: () => import('./features/admin/product-management/product-management').then(c => c.ProductManagement),
      canActivate: [adminGuard]
    },
    {
        path: 'admin/products/new',
        loadComponent: () => import('./features/products/add-product/add-product').then(c => c.AddProduct),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/products/edit/:id',
        loadComponent: () => import('./features/products/edit-product/edit-product').then(c => c.EditProduct),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/users',
        loadComponent: () => import('./features/admin/user-management/user-management').then(c => c.UserManagement),
        canActivate: [adminGuard]
    },
    {
        path: 'product/:id',
        loadComponent: () => import('./features/products/product-details/product-details').then(c => c.ProductDetails)
    }

];
