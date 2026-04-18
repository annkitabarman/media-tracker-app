import { Component, inject, signal, OnInit } from '@angular/core';
import { MediaRow } from '../media-row/media-row';
import { MoviesService } from '../../services/movies-service';
import { TrendingMediaType } from '../../models/movie-response.model';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-trending-section',
  imports: [MediaRow, CommonModule],
  templateUrl: './trending-section.html',
  styleUrl: './trending-section.scss',
})
export class TrendingSection implements OnInit {
  private readonly _moviesService = inject(MoviesService);

  moviesLoading = signal<boolean>(true);
  tvShowsLoading = signal<boolean>(true);

  moviesList = signal<TrendingMediaType[]>([]);
  tvShowsList = signal<TrendingMediaType[]>([]);
  tvShowsError = signal<boolean>(false);
  moviesError = signal<boolean>(false);
  trendType = signal<'day' | 'week'>('day');

  setTrend(type: 'day' | 'week') {
    this.trendType.set(type);
    this.moviesLoading.set(true);
    this.tvShowsLoading.set(true);
    this.fetchTrending();
  }

  ngOnInit() {
    this.fetchTrending();
  }

  fetchTrending() {
    this._moviesService
      .fetchTrendingAll(this.trendType())
      .pipe(
        finalize(() => {
          this.moviesLoading.set(false);
          this.tvShowsLoading.set(false);
        }),
      )
      .subscribe({
        next: (media) => {
          console.log(media);
          if (media.movies.length) {
            this.moviesList.set(media.movies);
          } else {
            this.moviesError.set(true);
          }

          if (media.tvShows.length) {
            this.tvShowsList.set(media.tvShows);
          } else {
            this.tvShowsError.set(true);
          }
        },
      });
  }
}
