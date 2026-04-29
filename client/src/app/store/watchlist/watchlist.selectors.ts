import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WatchlistState } from './watchlist.store';

export const selectWatchlistState =
  createFeatureSelector<WatchlistState>('watchlist');

export const selectWatchlistItems = createSelector(
  selectWatchlistState,
  (state) => state.items,
);

export const selectLoading = createSelector(
  selectWatchlistState,
  (state) => state.loading,
);

export const selectCurrentWatchlistItem = (id: number) =>
  createSelector(selectWatchlistItems, (items) =>
    items.find((item) => item.id === id),
  );

export const selectInWatchlist = (id: number) =>
  createSelector(selectWatchlistItems, (items) =>
    items.some((i) => i.id === id),
  );
