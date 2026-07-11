import { createReducer, on } from '@ngrx/store';
import { initialState } from './library.store';
import {
  addToLibrary,
  removeFromLibrary,
  loadLibrary,
  loadLibraryFailure,
  loadLibrarySuccess,
  editStatus,
} from './library.actions';

export const libraryReducer = createReducer(
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
  on(removeFromLibrary, (state, { id, watch_status }) => ({
    ...state,
    items: state.items
      .map((item) =>
        item.id === id
          ? {
              ...item,
              watch_status: item?.watch_status?.filter(
                (status) => status !== watch_status,
              ),
            }
          : item,
      )
      .filter((item) => item.watch_status?.length > 0),
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

  on(editStatus, (state, { id, watch_status }) => ({
    ...state,
    items: state.items?.map((item) =>
      item.id === id
        ? {
            ...item,
            watch_status: item.watch_status?.includes(watch_status)
              ? item?.watch_status
              : [...item?.watch_status, watch_status],
          }
        : item,
    ),
  })),
);
