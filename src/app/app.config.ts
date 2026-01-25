import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {AuthHeaderInterceptor, AuthRefreshInterceptor, ErrorInterceptor} from "./core/interceptors";
import {IMAGE_LOADER} from "@angular/common";
import {passThroughLoader} from "./core/config/image-loader";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
        withInterceptors([AuthHeaderInterceptor, AuthRefreshInterceptor, ErrorInterceptor])
    ),
    {provide: IMAGE_LOADER, useValue: passThroughLoader}
  ]
};
