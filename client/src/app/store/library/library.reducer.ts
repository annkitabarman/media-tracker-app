import { createReducer, on } from '@ngrx/store';
import { initialState } from './library.store';
import {
  addToLibrary,
  removeFromLibrary,
  loadLibrary,
  loadLibraryFailure,
  loadLibrarySuccess,
} from './library.actions';

export const watchlistReducer = createReducer(
  initialState,
  on(loadLibrary, (state) => ({ ...state, loading: true, error: null })),
  on(addToLibrary, (state, { item }) => {
    const alreadyExists = state.items.some((i) => i.id === item.id);

    return {
      ...state,
      items: alreadyExists ? state.items : [...state.items, item],
      error: alreadyExists ? 'Item already exists' : null,
    };
  }),
  on(removeFromLibrary, (state, { id }) => ({
    ...state,
    items: state.items.filter((i) => i.id !== id),
  })),
  on(loadLibrarySuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false,
  })),
  on(loadLibraryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
