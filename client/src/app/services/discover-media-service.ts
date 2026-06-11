import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, tap, map } from 'rxjs';

import { BASE_URL, IMAGE_BASE_URL } from '../constants/api-urls';
import { SearchResultResponse } from '../models/search-result.model';

interface CachedMediaState {
  results: SearchResultResponse[];
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

  private readonly _mediaSubject = new BehaviorSubject<SearchResultResponse[]>(
    [],
  );

  readonly media$ = this._mediaSubject.asObservable();

  fetchDiscoveryMedia(
    type: string,
    category: string,
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
          state!.results = [...state!.results, res];

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
