import { inject, Injectable } from '@angular/core';
import { BASE_URL, IMAGE_BASE_URL } from '../constants/api-urls';
import { Observable, map, tap, of } from 'rxjs';
import { CastDetailsResponse } from '../models/cast-response.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CastService {
  private readonly _baseUrl = BASE_URL;
  private readonly _imageBaseUrl = IMAGE_BASE_URL;
  private readonly _http = inject(HttpClient);

  fetchCastList(
    mediaType: 'movie' | 'tv',
    id: number,
  ): Observable<CastDetailsResponse> {
    const key = `cast-${mediaType}-${id}`;
    const cached = localStorage.getItem(key);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > 1000 * 60 * 60; // 1 hour
      const hasData = data?.cast?.length > 0 || data?.crew?.length > 0;

      if (!isExpired && hasData) {
        return of(data);
      }
    }
    return this._http
      .get<CastDetailsResponse>(`${this._baseUrl}/${mediaType}/${id}/credits`)
      .pipe(
        map((res) => {
          return {
            ...res,
            cast: res.cast.map((castMember) => {
              return {
                ...castMember,
                profile_path: castMember.profile_path
                  ? `${this._imageBaseUrl}${castMember.profile_path}`
                  : null,
              };
            }),
            crew: res.crew.map((crewMember) => {
              return {
                ...crewMember,
                profile_path: crewMember.profile_path
                  ? `${this._imageBaseUrl}${crewMember.profile_path}`
                  : null,
              };
            }),
          };
        }),
        tap((data) => {
          const hasData = data?.cast?.length > 0 || data?.crew?.length > 0;
          if (!hasData) return;

          localStorage.setItem(
            key,
            JSON.stringify({
              data: data,
              timestamp: Date.now(),
            }),
          );
        }),
      );
  }
}
