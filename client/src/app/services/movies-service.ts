import { Injectable, inject } from '@angular/core';
import { BASE_URL, IMAGE_BASE_URL, YOUTUBE_URL } from '../constants/api-urls';
import { Observable, map, forkJoin, catchError, of, tap, filter } from 'rxjs';
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
import { TrailerResponse } from '../models/videos.response.model';
import {
  WatchProviderResponse,
  CountryWatchProviders,
} from '../models/platform.response.model';

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

  fetchRecommendations(
    type: 'movie' | 'tv',
    id: number,
  ): Observable<TrendingMediaAPIResponse> {
    const key = `recommendation-${type}-${id}`;
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
      .get<TrendingMediaAPIResponse>(
        `${BASE_URL}/${type}/${id}/recommendations?language=en-US&page=1`,
      )
      .pipe(
        map((res) => ({
          ...res,
          results: res.results.map((show) => ({
            ...show,
            poster_path: show.poster_path
              ? `${IMAGE_BASE_URL}${show.poster_path}`
              : null,
            backdrop_path: show.backdrop_path
              ? `${IMAGE_BASE_URL}${show.backdrop_path}`
              : null,
          })),
        })),
        tap((data) => {
          if (!data.results.length) return;

          localStorage.setItem(
            key,
            JSON.stringify({
              data,
              mediaType: type,
              timestamp: Date.now(),
            }),
          );
        }),
        catchError(() =>
          of({
            page: 1,
            results: [],
            total_pages: 0,
            total_results: 0,
          } as TrendingMediaAPIResponse),
        ),
      );
  }

  fetchTrailer(
    type: 'movie' | 'tv',
    id: number,
  ): Observable<TrailerResponse | undefined> {
    const key = `trailer-${type}-${id}`;
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
      .get<{
        id: number;
        results: TrailerResponse[];
      }>(`${BASE_URL}/${type}/${id}/videos`)
      .pipe(
        map((res) => {
          return (
            res.results.find(
              (v) => v.site === 'YouTube' && v.type == 'Trailer' && v.official,
            ) ??
            res.results.find(
              (v) => v.site === 'YouTube' && v.type === 'Teaser' && v.official,
            )
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

  fetchPlatforms(
    type: 'movie' | 'tv',
    id: number,
  ): Observable<CountryWatchProviders> {
    const key = `platforms-${type}-${id}`;
    const cached = localStorage.getItem(key);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = this.checkExpiry(timestamp, 1000 * 60 * 60);

      if (!isExpired) {
        return of(data);
      }
    }

    return this._httpClient
      .get<WatchProviderResponse>(
        `${this._baseUrl}/${type}/${id}/watch/providers`,
      )
      .pipe(
        map((data) => {
          const providers = data.results.IN;

          return {
            ...providers,
            flatrate: providers.flatrate?.map((provider) => ({
              ...provider,
              logo_path: `${IMAGE_BASE_URL}${provider.logo_path}`,
            })),
          };
        }),

        tap((res) => {
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
}
