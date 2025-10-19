import {catchError, finalize, Subject, switchMap, throwError} from "rxjs";
import {HttpErrorResponse, HttpRequest} from "@angular/common/http";
import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {AuthService} from "../services";
import {RETRIED_ONCE} from "./flags/retry-flag";

let refreshing = false;
let refreshSubject: Subject<string> | null = null;

function cloneWithToken(req: HttpRequest<any>, token: string) {
    return req.clone({setHeaders: {Authorization: `Bearer ${token}`}});
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

                if (httpErr.status !== 401) {
                    return throwError(() => err);
                }

                const alreadyRetried = req.context.get(RETRIED_ONCE);
                if (alreadyRetried) {
                    authService.logout$();
                    return throwError(() => err);
                }

                if (!refreshing) {
                    refreshing = true;
                    refreshSubject = new Subject<string>();

                    authService.getFreshAccessToken$()
                        .subscribe({
                            next: (newToken) => {
                                refreshSubject!.next(newToken);
                                refreshSubject!.complete();
                            },
                            error: () => {
                                refreshSubject!.error('refresh_failed');
                            },
                            complete: () => {
                                refreshing = false;
                            }
                        });
                }

                return refreshSubject!.pipe(
                    switchMap((newToken) => {
                        const retried = req.clone({
                            context: req.context.set(RETRIED_ONCE, true)
                        });
                        return next(cloneWithToken(retried, newToken));
                    }),
                    catchError(() => {
                        authService.logout$();
                        return throwError(() => err)
                    }),
                    finalize(() => {

                    })
                );
            }
        )
    )
}