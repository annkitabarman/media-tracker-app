import { LanguageResponse } from './language-response.model';
import { ProductionCompany, ProductionCountry } from './tv.response.model';
import { TvDetails } from './tv.response.model';

export interface TrendingMediaType {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  name: string;
  original_name: string;
  first_air_date: string;
  media_type: 'movie' | 'tv';
}

export interface TrendingMediaAPIResponse {
  page: number;
  results: TrendingMediaType[];
  total_pages: number;
  total_results: number;
}

export type MediaDetailsResponse =
  | (MovieDetails & { mediaType: 'movie' })
  | (TvDetails & { mediaType: 'tv' });

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: Collection | null;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: LanguageResponse[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface KeyWordsResponse {
  id: number;
  keywords: Keyword[];
}
