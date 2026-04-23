import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page/home-page').then((m) => m.HomePage),
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
