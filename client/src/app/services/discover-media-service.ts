import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, tap, map } from 'rxjs';
import { BASE_URL, IMAGE_BASE_URL } from '../constants/api-urls';
import { SearchResultResponse } from '../models/search-result.model';
import { TrendingMediaType } from '../models/movie-response.model';

interface CachedMediaState {
  results: TrendingMediaType[];
  currentPage: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class DiscoverMediaService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrl = BASE_URL;
  private readonly _imageUrl = IMAGE_BASE_URL;

  private _loading = false;

  private readonly cache = new Map<string, CachedMediaState>();

  private readonly _mediaSubject = new BehaviorSubject<TrendingMediaType[]>([]);

  readonly media$ = this._mediaSubject.asObservable();

  fetchDiscoveryMedia(
    type: string,
    category: string,
    filters?: {
      sort: string | null;
      genres: number[] | null;
      from_date: string | null;
      to_date: string | null;
      keywords: string | null;
    },
  ): Observable<SearchResultResponse> {
    const key = `${type}-${category}`;

    // Get cache
    let state = this.cache.get(key);

    // Initialize if absent
    if (!state) {
      state = {
        results: [],
        currentPage: 1,
        totalPages: Infinity,
      };

      this.cache.set(key, state);
    }

    // Prevent duplicate requests
    if (this._loading) {
      return EMPTY;
    }

    // No more pages
    if (state.currentPage > state.totalPages) {
      return EMPTY;
    }

    this._loading = true;

    const url =
      `${this._baseUrl}/${type}/${category}` +
      `?language=en-US&page=${state.currentPage}`;

    return this._httpClient.get<SearchResultResponse>(url).pipe(
      map((data) => {
        return {
          ...data,
          results: data.results.map((item) => ({
            ...item,
            backdrop_path: item.backdrop_path
              ? `${this._imageUrl}${item.backdrop_path}`
              : null,
            poster_path: null,
          })),
        };
      }),
      tap({
        next: (res) => {
          state!.results = [...state!.results, ...res.results];

          state!.currentPage++;
          state!.totalPages = res.total_pages;

          this._mediaSubject.next(state!.results);

          this._loading = false;
        },

        error: () => {
          this._loading = false;
        },
      }),
    );
  }

  fetchFilteredMedia(
    type: string,
    filters: {
      sort: string | null;
      genres: number[] | null;
      from_date: string | null;
      to_date: string | null;
    },
  ): Observable<SearchResultResponse> {
    let params = new HttpParams().set('language', 'en-US').set('page', '1');

    if (filters.sort) {
      params = params.set('sort_by', filters.sort);
    }

    if (filters.genres?.length) {
      params = params.set('with_genres', filters.genres.join(','));
    }

    if (filters.from_date) {
      params = params.set('primary_release_date.gte', filters.from_date);
    }

    if (filters.to_date) {
      params = params.set('primary_release_date.lte', filters.to_date);
    }

    const url = `${this._baseUrl}/discover/${type}`;

    return this._httpClient.get<SearchResultResponse>(url, { params }).pipe(
      map((data) => ({
        ...data,
        results: data.results.map((item) => ({
          ...item,
          backdrop_path: item.backdrop_path
            ? `${this._imageUrl}${item.backdrop_path}`
            : null,
          poster_path: null,
        })),
      })),
    );
  }

  loadFromCache(type: string, category: string): void {
    const key = `${type}-${category}`;

    const state = this.cache.get(key);

    if (state) {
      this._mediaSubject.next(state.results);
    }
  }

  reset(type: string, category: string): void {
    const key = `${type}-${category}`;

    this.cache.delete(key);

    this._mediaSubject.next([]);
  }

  hasMore(type: string, category: string): boolean {
    const key = `${type}-${category}`;

    const state = this.cache.get(key);

    if (!state) return true;

    return state.currentPage <= state.totalPages;
  }

  isLoading(): boolean {
    return this._loading;
  }
}
