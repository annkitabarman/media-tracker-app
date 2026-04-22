import { Injectable, inject } from '@angular/core';
import { LanguageResponse } from '../models/language-response.model';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constants/api-urls';
import { Observable, map, tap, of, shareReplay, share } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private readonly _baseUrl = BASE_URL;
  private readonly _httpClient = inject(HttpClient);
  private _languageMap$: Observable<Record<string, string>> | null = null;

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
}
