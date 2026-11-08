import {Routes} from '@angular/router';

// Demo build only (ng build --configuration demo): swapped in for app.routes.ts.
// The home page is the only page; every other link lands back on it.
export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home').then(c => c.Home)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
