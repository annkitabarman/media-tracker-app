import { Injectable, inject } from '@angular/core';
import { BASE_URL, IMAGE_BASE_URL } from '../constants/api-urls';
import { Observable, map, forkJoin, catchError, of, tap } from 'rxjs';
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
      const hasData = data?.movies?.length > 0 || data?.tvShows?.length > 0;

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
                poster_path: `${IMAGE_BASE_URL}${movie.poster_path}`,
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
                poster_path: `${IMAGE_BASE_URL}${show.poster_path}`,
              };
            }),
          ),
          catchError((error) => of([])),
        ),
    }).pipe(
      tap((res) => {
        const hasData = res.movies.length > 0 || res.tvShows.length > 0;
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
    return this._httpClient
      .get<MediaDetailsResponse>(
        `${this._baseUrl}/${type}/${id}?language=en-US`,
      )
      .pipe(
        map((res) => {
          return {
            ...res,
            backdrop_path: `${IMAGE_BASE_URL}${res.backdrop_path}`,
            poster_path: `${IMAGE_BASE_URL}${res.poster_path}`,
          };
        }),
      );
  }
}
