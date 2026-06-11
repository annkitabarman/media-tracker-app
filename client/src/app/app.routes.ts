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
    path: ':type/discover/:category',
    loadComponent: () =>
      import('./pages/discover-media/discover-media').then(
        (m) => m.DiscoverMedia,
      ),
  },
  {
    path: ':type/:id',
    loadComponent: () =>
      import('./pages/media-details/media-details').then((m) => m.MediaDetails),
  },
];
