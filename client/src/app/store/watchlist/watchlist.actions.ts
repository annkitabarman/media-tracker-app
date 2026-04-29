import { createAction, props } from '@ngrx/store';
import { WatchlistMediaModel } from '../../models/watchlist-media.model';

export const loadWatchlist = createAction('[Watchlist] Load Watchlist');

export const addToWatchlist = createAction(
  '[Watchlist] Add New to Watchlist',
  props<{ item: WatchlistMediaModel }>(),
);

export const removeFromWatchlist = createAction(
  '[Watchlist] Remove from Watchlist',
  props<{ id: number }>(),
);

export const updateWatchlist = createAction(
  '[Watchlist] Update Watchlist',
  props<{ item: WatchlistMediaModel }>(),
);

export const loadWatchlistSuccess = createAction(
  '[Watchlist] Load Watchlist Success',
  props<{ items: WatchlistMediaModel[] }>(),
);

export const loadWatchlistFailure = createAction(
  '[Watchlist] Load Watchlist Failure',
  props<{ error: string }>(),
);
