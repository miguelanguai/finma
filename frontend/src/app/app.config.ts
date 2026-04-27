import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

const FinmaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
    colorScheme: {
      light: {
        primary: {
          color:        '{primary.600}',
          inverseColor: '#ffffff',
          hoverColor:   '{primary.700}',
          activeColor:  '{primary.800}',
        },
        highlight: {
          background:      '{primary.50}',
          focusBackground: '{primary.100}',
          color:           '{primary.700}',
          focusColor:      '{primary.800}',
        },
      },
      dark: {
        primary: {
          color:        '{primary.400}',
          inverseColor: '{primary.950}',
          hoverColor:   '{primary.300}',
          activeColor:  '{primary.200}',
        },
        highlight: {
          background:      'color-mix(in srgb, {primary.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
          color:           'rgba(255,255,255,.87)',
          focusColor:      'rgba(255,255,255,.87)',
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: FinmaPreset,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
    provideRouter(routes),
  ],
};
