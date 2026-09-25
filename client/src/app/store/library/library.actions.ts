import { createAction, props } from '@ngrx/store';
import { LibraryMediaModel } from '../../models/library-media.model';

export const loadLibrary = createAction('[Library] Load Library');

export const addToLibrary = createAction(
  '[Library] Add New to Library',
  props<{ item: LibraryMediaModel }>(),
);

export const removeFromLibrary = createAction(
  '[Library] Remove from Library',
  props<{ id: number; watch_status: string }>(),
);

export const loadLibrarySuccess = createAction(
  '[Library] Load Library Success',
  props<{ items: LibraryMediaModel[] }>(),
);

export const loadLibraryFailure = createAction(
  '[Library] Load Library Failure',
  props<{ error: string }>(),
);

export const editStatus = createAction(
  '[Library] Modify watch status',
  props<{ id: number; watch_status: string }>(),
);
