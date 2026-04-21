import { inject, Injectable } from '@angular/core';
import { BASE_URL, IMAGE_BASE_URL } from '../constants/api-urls';
import { Observable, map, tap } from 'rxjs';
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
      );
  }
}
