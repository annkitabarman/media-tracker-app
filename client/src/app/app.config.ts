import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideLottieOptions } from 'ngx-lottie';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { watchlistReducer } from './store/watchlist/watchlist.reducer';
import { provideFlatpickrDefaults } from 'angularx-flatpickr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideFlatpickrDefaults(),
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
    provideStore({
      watchlist: watchlistReducer,
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
