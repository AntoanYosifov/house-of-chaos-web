import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {AuthService} from "../services";

export const AuthHeaderInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.includes('/auth/login') ||
        req.url.includes('/auth/refresh') ||
        req.url.includes('/users/register') ||
        req.url.includes('/api.imgbb.com/')) {
        return next(req);
    }
    const authService = inject(AuthService);
    const accessToken = authService.getAccessToken();
    if(!accessToken) {
        return next(req);
    }

    const authenticationRequest = req.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return next(authenticationRequest);
}