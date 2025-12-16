import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideRouter(routes)
  ]
};
