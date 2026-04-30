import { createReducer, on } from '@ngrx/store';
import { initialState } from './watchlist.store';
import {
  addToWatchlist,
  removeFromWatchlist,
  loadWatchlist,
  loadWatchlistFailure,
  loadWatchlistSuccess,
} from './watchlist.actions';

export const watchlistReducer = createReducer(
  initialState,
  on(loadWatchlist, (state) => ({ ...state, loading: true, error: null })),
  on(addToWatchlist, (state, { item }) => {
    const alreadyExists = state.items.some((i) => i.id === item.id);

    return {
      ...state,
      items: alreadyExists ? state.items : [...state.items, item],
      error: alreadyExists ? 'Item already exists' : null,
    };
  }),
  on(removeFromWatchlist, (state, { id }) => ({
    ...state,
    items: state.items.filter((i) => i.id !== id),
  })),
  on(loadWatchlistSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false,
  })),
  on(loadWatchlistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
