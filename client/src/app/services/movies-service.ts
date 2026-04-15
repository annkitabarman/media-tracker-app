import { Injectable, inject } from '@angular/core';
import { BASE_URL } from '../constants/api-urls';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  TrendingMoviesType,
  TrendingMoviesAPIResponse,
} from '../models/movie-response.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private readonly _baseUrl = BASE_URL;

  private readonly _httpClient = inject(HttpClient);

  fetchTrendingMovies(): Observable<TrendingMoviesType[]> {
    return this._httpClient
      .get<TrendingMoviesAPIResponse>(`${this._baseUrl}/trending/movie/day`)
      .pipe(
        map((res) => res.results),
        map((movies) => {
          return movies.map((movie) => {
            return {
              ...movie,
              poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            };
          });
        }),
      );
  }
}
