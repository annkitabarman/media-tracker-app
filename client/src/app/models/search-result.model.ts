import { TrendingMediaType } from './movie-response.model';

export type SuggestionItem = {
  label: string;
  poster_path?: string | null;
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
  poster_path: string | null;
  media_type: 'movie' | 'tv';
  release_date: string;
  overview: string;
  original_title: string;
}

export interface SearchResultsPayload {
  results: SearchResultItem[];
  totalPages: number;
}
