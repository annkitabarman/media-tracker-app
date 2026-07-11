import { LibraryMediaModel } from '../../models/library-media.model';

export interface LibraryState {
  items: LibraryMediaModel[];
  loading: boolean;
  error: string | null;
}

export const initialState: LibraryState = {
  items: [],
  loading: false,
  error: null,
};
