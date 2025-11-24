import {inject} from '@angular/core';
import {Router, CanActivateFn} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const adminGuard: CanActivateFn = (_route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    const currentUser = authService.currentUser();
    
    if (!currentUser) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
    
    const isAdmin = currentUser.roles.includes('ADMIN');
    
    if (!isAdmin) {
        router.navigate(['/home']);
        return false;
    }
    
    return true;
};
