import { WatchlistMediaModel } from '../../models/watchlist-media.model';

export interface WatchlistState {
  items: WatchlistMediaModel[];
  loading: boolean;
  error: string | null;
}

export const initialState: WatchlistState = {
  items: [],
  loading: false,
  error: null,
};
