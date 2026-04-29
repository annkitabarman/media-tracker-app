import { Injectable, inject } from '@angular/core';
import { BASE_URL, IMAGE_BASE_URL } from '../constants/api-urls';
import { Observable, map, forkJoin, catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  TrendingMediaType,
  TrendingMediaAPIResponse,
  MediaDetailsResponse,
  KeyWordsResponse,
} from '../models/movie-response.model';
import { RatedMediaModel } from '../models/rated-media.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private readonly _baseUrl = BASE_URL;

  private readonly _httpClient = inject(HttpClient);

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
    const key = `details-${type}-${id}`;
    const cached = localStorage.getItem(key);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);

      const isExpired = this.checkExpiry(timestamp, 1000 * 60 * 10); // 10 minutes
      const hasData = data?.id === id;

      if (!isExpired && hasData) {
        return of(data);
      }
    }
    return this._httpClient
      .get<MediaDetailsResponse>(
        `${this._baseUrl}/${type}/${id}?language=en-US`,
      )
      .pipe(
        map((res) => {
          return {
            ...res,
            backdrop_path: res.backdrop_path
              ? `${IMAGE_BASE_URL}${res.backdrop_path}`
              : null,
            poster_path: res.poster_path
              ? `${IMAGE_BASE_URL}${res.poster_path}`
              : null,
          };
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
      .get<KeyWordsResponse>(`${this._baseUrl}/${type}/${id}/keywords`)
      .pipe(
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

  fetchRatings(): Observable<RatedMediaModel[]> {
    const key = 'my-ratings';
    const cached = localStorage.getItem(key);

    if (!cached) return of([]);

    const data = JSON.parse(cached);

    return of(data);
  }

  addNewRating(rating: RatedMediaModel): { success: boolean; message: string } {
    if (!rating) return { success: false, message: 'Invalid payload' };
    const key = 'my-ratings';

    const cached = localStorage.getItem(key);
    const allRatings: RatedMediaModel[] = cached ? JSON.parse(cached) : [];

    allRatings.push(rating);
    localStorage.setItem(key, JSON.stringify(allRatings));
    return { success: true, message: 'New entry added!' };
  }
}
