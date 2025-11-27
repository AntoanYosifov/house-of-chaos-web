import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    // Skip auth endpoints and external APIs (same pattern as other interceptors)
    if (
        req.url.includes('/auth/login') ||
        req.url.includes('/auth/refresh') ||
        req.url.includes('/users/register') ||
        req.url.includes('/api.imgbb.com/')
    ) {
        return next(req);
    }

    return next(req).pipe(
        catchError((err: unknown) => {
            const httpErr = err as HttpErrorResponse;
            
            // Only handle 500 Internal Server Errors
            if (httpErr.status === 500) {
                // Navigate to error page
                router.navigate(['/error']);
                // Return error to prevent further propagation
                return throwError(() => err);
            }

            // Pass through all other errors (401, 409, 400, etc.)
            return throwError(() => err);
        })
    );
};

