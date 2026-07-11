import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LibraryState } from './library.store';

export const selectLibraryState =
  createFeatureSelector<LibraryState>('library');

export const selectLibraryItems = createSelector(
  selectLibraryState,
  (state) => state.items,
);

export const selectLoading = createSelector(
  selectLibraryState,
  (state) => state.loading,
);

export const selectCurrentLibraryItem = (id: number) =>
  createSelector(selectLibraryItems, (items) =>
    items.find((item) => item.id === id),
  );

export const selectInLibrary = (id: number) =>
  createSelector(selectLibraryItems, (items) => items.some((i) => i.id === id));
