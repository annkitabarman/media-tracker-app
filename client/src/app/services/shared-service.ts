import { Injectable, inject } from '@angular/core';
import { LanguageResponse } from '../models/language-response.model';
import { HttpClient } from '@angular/common/http';
import { BASE_URL, IMAGE_BASE_URL } from '../constants/api-urls';
import { Observable, map, tap, of, shareReplay } from 'rxjs';
import {
  SearchResultResponse,
  SuggestionItem,
  SearchResultItem,
} from '../models/search-result.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private readonly _baseUrl = BASE_URL;
  private readonly _imgUrl = IMAGE_BASE_URL;
  private readonly _httpClient = inject(HttpClient);
  private _languageMap$: Observable<Record<string, string>> | null = null;
  movieGenre$: Observable<Record<string, string>> = this.fetchGenres(
    'movie',
  ).pipe(shareReplay(1));
  tvGenre$: Observable<Record<string, string>> = this.fetchGenres('tv').pipe(
    shareReplay(1),
  );

  fetchLanguageMapping(): Observable<Record<string, string>> {
    const key = 'language-mapping';

    if (this._languageMap$) {
      return this._languageMap$;
    }

    const cached = localStorage.getItem(key);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);

      const isExpired = Date.now() - timestamp > 1000 * 60 * 60; // 1 hour
      const hasData = data && Object.keys(data).length > 0;

      if (!isExpired && hasData) {
        this._languageMap$ = of(data);
        return this._languageMap$;
      }
    }
    this._languageMap$ = this._httpClient
      .get<LanguageResponse[]>(`${this._baseUrl}/configuration/languages`)
      .pipe(
        map((res) => {
          const mapping: Record<string, string> = {};
          res.forEach((lang) => {
            mapping[lang.iso_639_1] = lang.english_name;
          });
          return mapping;
        }),
        tap((mapping) => {
          const hasData = mapping && Object.keys(mapping).length > 0;
          if (!hasData) return;

          localStorage.setItem(
            key,
            JSON.stringify({
              data: mapping,
              timestamp: Date.now(),
            }),
          );
        }),
        shareReplay(1),
      );

    return this._languageMap$;
  }

  fetchGenres(mediaType: 'movie' | 'tv'): Observable<Record<string, string>> {
    const key = `${mediaType}-genre-mapping`;

    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);

      const isExpired = Date.now() - timestamp > 1000 * 60 * 60 * 24; // 24 hours
      const hasData = data && Object.keys(data).length > 0;

      if (!isExpired && hasData) {
        return of(data);
      }
    }

    return this._httpClient
      .get<{
        genres: { id: number; name: string }[];
      }>(`${this._baseUrl}/genre/${mediaType}/list?language=en-US`)
      .pipe(
        map((res) => {
          const mapping: Record<string, string> = {};
          res.genres.forEach((genre) => {
            mapping[genre.id.toString()] = genre.name;
          });
          return mapping;
        }),
        tap((mapping) => {
          const hasData = mapping && Object.keys(mapping).length > 0;
          if (!hasData) return;
          localStorage.setItem(
            key,
            JSON.stringify({ data: mapping, timestamp: Date.now() }),
          );
        }),
      );
  }

  fetchSuggestions(query: string): Observable<SuggestionItem[]> {
    const url = `${this._baseUrl}/search/multi`;

    return this._httpClient
      .get<SearchResultResponse>(url, {
        params: {
          query,
          include_adult: false,
          language: 'en-US',
          page: 1,
        },
      })
      .pipe(
        map((response) => [
          ...response.results
            .filter(
              (item) => item.media_type === 'movie' || item.media_type === 'tv',
            )
            .slice(0, 7)
            .map((item) => ({
              label: item.title || item.name,
              query: item.title || item.name,
              poster_path: `${this._imgUrl}${item.poster_path}`,
              media_type: item.media_type,
              year: item.release_date || item.first_air_date,
              type: 'result',
            })),
          {
            label: `Search ${query}`,
            query: query,
            type: 'query',
          },
        ]),
      );
  }

  fetchSearchResults(query: string): Observable<SearchResultItem[]> {
    const url = `${this._baseUrl}/search/multi`;

    return this._httpClient
      .get<SearchResultResponse>(url, {
        params: {
          query,
          include_adult: false,
          language: 'en-US',
          page: 1,
        },
      })
      .pipe(map((res) => res.results));
  }
}
