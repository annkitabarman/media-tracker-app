import { Routes } from '@angular/router';
import { SearchResults } from './pages/search-results/search-results';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search-results/search-results').then(
        (m) => SearchResults,
      ),
  },
  {
    path: 'user/:section',
    loadComponent: () =>
      import('./pages/user-profile/user-profile').then((m) => m.UserProfile),
  },
  {
    path: ':type/:id',
    loadComponent: () =>
      import('./pages/media-details/media-details').then((m) => m.MediaDetails),
  },
  {
    path: ':type/:category',
    loadComponent: () =>
      import('./pages/media-collection/media-collection').then(
        (m) => m.MediaCollection,
      ),
  },
];
