import { Injectable, inject } from '@angular/core';
import { BASE_URL } from '../constants/api-urls';
import {
  Observable,
  map,
  forkJoin,
  catchError,
  of,
  tap,
  shareReplay,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  TrendingMediaType,
  TrendingMediaAPIResponse,
  MediaDetailsResponse,
} from '../models/movie-response.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private readonly _baseUrl = BASE_URL;

  private readonly _httpClient = inject(HttpClient);

  fetchTrendingAll(trendType: 'day' | 'week'): Observable<{
    movies: TrendingMediaType[];
    tvShows: TrendingMediaType[];
  }> {
    const key = `trending-${trendType}`;
    const cached = localStorage.getItem(key);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);

      const isExpired = Date.now() - timestamp > 1000 * 60 * 10; // 10 min

      if (!isExpired) {
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
                poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
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
                poster_path: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
              };
            }),
          ),
          catchError((error) => of([])),
        ),
    }).pipe(
      tap((res) => {
        localStorage.setItem(
          key,
          JSON.stringify({
            data: res,
            timestamp: Date.now(),
          }),
        );
      }),
      shareReplay(1),
    );
  }

  fetchMediaDetails(
    id: number,
    type: 'movie' | 'tv',
  ): Observable<MediaDetailsResponse> {
    return this._httpClient
      .get<MediaDetailsResponse>(
        `${this._baseUrl}/${type}/${id}?language=en-US`,
      )
      .pipe(
        map((res) => {
          return {
            ...res,
            backdrop_path: `https://image.tmdb.org/t/p/w500${res.backdrop_path}`,
            poster_path: `https://image.tmdb.org/t/p/w500${res.poster_path}`,
          };
        }),
      );
  }
}
