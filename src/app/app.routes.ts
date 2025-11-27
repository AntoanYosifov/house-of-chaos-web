import {Routes} from '@angular/router';
import {adminGuard} from './core/guards/admin-guard';
import {authGuard} from './core/guards/auth-guard';

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
        path: 'cart',
        loadComponent: () => import('./features/cart/cart/cart').then(c => c.Cart),
        canActivate: [authGuard]
    },
    {
        path: 'orders/:id',
        loadComponent: () => import('./features/orders/order/order').then(c => c.Order),
        canActivate: [authGuard]
    },
    {
        path: 'orders/:id/confirmed',
        loadComponent: () => import('./features/orders/order-confirmed/order-confirmed').then(c => c.OrderConfirmed),
        canActivate: [authGuard]
    },
    {
        path: 'orders/:id/cancelled',
        loadComponent: () => import('./features/orders/order-cancelled/order-cancelled').then(c => c.OrderCancelled),
        canActivate: [authGuard]
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
        path: 'admin/categories',
        loadComponent: () => import('./features/admin/category-management/category-management').then(c => c.CategoryManagement),
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
        path: 'products/category/:categoryId',
        loadComponent: () => import('./features/products/products-by-category/products-by-category').then(c => c.ProductsByCategory)
    },
    {
        path: 'products/new-arrivals',
        loadComponent: () => import('./features/products/new-arrivals/new-arrivals').then(c => c.NewArrivals)
    },
    {
        path: 'products/top-deals',
        loadComponent: () => import('./features/products/top-deals/top-deals').then(c => c.TopDeals)
    },
    {
        path: 'products/:id',
        loadComponent: () => import('./features/products/product-details/product-details').then(c => c.ProductDetails)
    }

];
