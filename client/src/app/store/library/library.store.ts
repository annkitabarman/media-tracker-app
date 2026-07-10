import { LibraryMediaModel } from '../../models/library-media.model';

export interface WatchlistState {
  items: LibraryMediaModel[];
  loading: boolean;
  error: string | null;
}

export const initialState: WatchlistState = {
  items: [],
  loading: false,
  error: null,
};
