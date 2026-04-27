import { TrendingMediaType } from './movie-response.model';

export type SuggestionItem = {
  label: string;
  poster_path?: string;
  media_type?: 'movie' | 'tv';
  year?: string;
  query: string;
  type: string;
};

export interface SearchResultResponse {
  page: number;
  results: TrendingMediaType[];
  total_pages: number;
  total_results: number;
}

export interface SearchResultItem {
  id: number;
  title: string;
  name?: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
}
