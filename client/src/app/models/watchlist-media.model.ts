export interface WatchlistMediaModel {
  name: string;
  year: string;
  poster: string;
  mediaType: 'movie' | 'tv';
  id: number;
  overview: string;
  original_lang: string;
  vote_average: number;
}
