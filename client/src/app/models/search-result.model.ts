import { TrendingMediaType } from './movie-response.model';

export interface SuggestionItem {
  id?: number;
  label: string;
  query: string;
  poster_path?: string | null;
  media_type?: 'movie' | 'tv';
  year?: string;
  type: 'result' | 'query';
}

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
