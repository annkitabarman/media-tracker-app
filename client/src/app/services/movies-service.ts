import { Injectable, inject } from '@angular/core';
import { BASE_URL, IMAGE_BASE_URL } from '../constants/api-urls';
import { Observable, map, forkJoin, catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  TrendingMediaType,
  TrendingMediaAPIResponse,
  KeyWordsResponse,
  MovieDetails,
  MediaDetailsResponse,
} from '../models/movie-response.model';
import { TvDetails } from '../models/tv.response.model';
import { LibraryMediaModel } from '../models/library-media.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private readonly _baseUrl = BASE_URL;

  private readonly _httpClient = inject(HttpClient);

  private addCommonFields = (res: any) => ({
    backdrop_path: res.backdrop_path
      ? `${IMAGE_BASE_URL}${res.backdrop_path}`
      : null,
    poster_path: res.poster_path ? `${IMAGE_BASE_URL}${res.poster_path}` : null,
  });

  checkExpiry(timestamp: number, expectedTime: number): boolean {
    return Date.now() - timestamp > expectedTime;
  }

  fetchTrendingAll(trendType: 'day' | 'week'): Observable<{
    movies: TrendingMediaType[];
    tvShows: TrendingMediaType[];
  }> {
    const key = `trending-${trendType}`;
    const cached = localStorage.getItem(key);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);

      const isExpired = this.checkExpiry(timestamp, 1000 * 60 * 60); // 1 hour
      const hasData = data?.movies?.length > 0 && data?.tvShows?.length > 0;

      if (!isExpired && hasData) {
        return of(data);
      }
    }

    return forkJoin({
      movies: this._httpClient
        .get<TrendingMediaAPIResponse>(
          `${this._baseUrl}/trending/movie/${trendType}`,
        )
        .pipe(
          map((res) =>
            res.results.map((movie) => {
              return {
                ...movie,
                poster_path: movie.poster_path
                  ? `${IMAGE_BASE_URL}${movie.poster_path}`
                  : null,
              };
            }),
          ),
          catchError((error) => of([])),
        ),

      tvShows: this._httpClient
        .get<TrendingMediaAPIResponse>(
          `${this._baseUrl}/trending/tv/${trendType}`,
        )
        .pipe(
          map((res) =>
            res.results.map((show) => {
              return {
                ...show,
                poster_path: show.poster_path
                  ? `${IMAGE_BASE_URL}${show.poster_path}`
                  : null,
              };
            }),
          ),
          catchError((error) => of([])),
        ),
    }).pipe(
      tap((res) => {
        const hasData = res.movies.length > 0 && res.tvShows.length > 0;
        if (!hasData) return;
        localStorage.setItem(
          key,
          JSON.stringify({
            data: res,
            timestamp: Date.now(),
          }),
        );
      }),
    );
  }

  fetchMediaDetails(
    id: number,
    type: 'movie' | 'tv',
  ): Observable<MediaDetailsResponse> {
    const key = `details-${type}-${id}`;
    const cached = localStorage.getItem(key);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);

      const isExpired = this.checkExpiry(timestamp, 1000 * 60 * 10);
      const hasData = data?.id === id;

      // 🔥 Fix old cache (missing mediaType)
      if (data && !data.mediaType) {
        data.mediaType = type;
      }

      if (!isExpired && hasData) {
        return of(data);
      }
    }

    return this._httpClient
      .get<
        MovieDetails | TvDetails
      >(`${this._baseUrl}/${type}/${id}?language=en-US`)
      .pipe(
        map((res) => {
          if (type === 'movie') {
            return {
              ...(res as MovieDetails),
              ...this.addCommonFields(res),
              mediaType: 'movie' as const,
            };
          } else {
            return {
              ...(res as TvDetails),
              ...this.addCommonFields(res),
              mediaType: 'tv' as const,
            };
          }
        }),
        tap((res) => {
          if (res?.id !== id) return;

          localStorage.setItem(
            key,
            JSON.stringify({
              data: res,
              timestamp: Date.now(),
            }),
          );
        }),
      );
  }

  fetchKeywords(
    id: number,
    type: 'movie' | 'tv',
  ): Observable<KeyWordsResponse> {
    const key = `keywords-${type}-${id}`;
    const cached = localStorage.getItem(key);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = this.checkExpiry(timestamp, 1000 * 60 * 60); // 1 hour
      const hasData = data?.id === id;

      if (!isExpired && hasData) {
        return of(data);
      }
    }
    return this._httpClient
      .get<any>(`${this._baseUrl}/${type}/${id}/keywords`)
      .pipe(
        map((data) => {
          return { id: data.id, keywords: data.keywords || data.results };
        }),
        tap((res) => {
          const hasData = res?.id === id;
          if (!hasData) return;

          localStorage.setItem(
            key,
            JSON.stringify({
              data: res,
              timestamp: Date.now(),
            }),
          );
        }),
      );
  }

  fetchLibrary(): LibraryMediaModel[] {
    const cached = localStorage.getItem('my-library');
    return cached ? JSON.parse(cached) : [];
  }

  saveLibrary(items: LibraryMediaModel[]): void {
    if (!items) return;
    const key = 'my-library';
    localStorage.setItem(key, JSON.stringify(items));
  }
}
