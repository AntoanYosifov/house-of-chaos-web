import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Prevent browser scroll restoration from shifting content under the sticky header on reload/navigation
try {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }
} catch {}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
