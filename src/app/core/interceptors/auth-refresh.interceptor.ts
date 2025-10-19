import { catchError, defer, finalize, shareReplay, switchMap, take, throwError } from 'rxjs';
import { HttpErrorResponse, HttpRequest, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services';
import { RETRIED_ONCE } from './flags/retry-flag';

let refresh$: ReturnType<AuthService['getFreshAccessToken$']> | null = null;

function cloneWithToken(req: HttpRequest<any>, token: string) {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function getInFlightRefresh(auth: AuthService) {
    if (!refresh$) {
        refresh$ = defer(() => auth.getFreshAccessToken$()).pipe(
            shareReplay({ bufferSize: 1, refCount: false }),
            finalize(() => {
                refresh$ = null;
            })
        );
    }
    return refresh$;
}

export const AuthRefreshInterceptor: HttpInterceptorFn = (req, next) => {
    if (
        req.url.includes('/users/auth/login') ||
        req.url.includes('/users/auth/refresh') ||
        req.url.includes('/users/register')
    ) {
        return next(req);
    }

    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((err: unknown) => {
            const httpErr = err as HttpErrorResponse;
            if (httpErr.status !== 401) return throwError(() => err);

            const alreadyRetried = req.context.get(RETRIED_ONCE);
            if (alreadyRetried) {
                authService.clientOnlyLogout();
                return throwError(() => err);
            }

            return getInFlightRefresh(authService).pipe(
                take(1),
                switchMap((newToken) => {
                    const retried = req.clone({
                        context: req.context.set(RETRIED_ONCE, true)
                    });
                    return next(cloneWithToken(retried, newToken));
                }),
                catchError(() => {
                    authService.clientOnlyLogout();
                    return throwError(() => err);
                })
            );
        })
    );
};
