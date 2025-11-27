import {inject} from '@angular/core';
import {Router, CanActivateFn} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const adminGuard: CanActivateFn = (_route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    const currentUser = authService.currentUser();
    
    if (!currentUser) {
        // Redirect to not-found page instead of login for admin routes
        router.navigate(['/not-found']);
        return false;
    }
    
    const isAdmin = currentUser.roles.includes('ADMIN');
    
    if (!isAdmin) {
        // Non-admin users trying to access admin routes see not-found
        router.navigate(['/not-found']);
        return false;
    }
    
    return true;
};
