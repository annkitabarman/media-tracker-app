import { Component, inject, signal, OnInit } from '@angular/core';
import { MediaRow } from '../media-row/media-row';
import { MoviesService } from '../../services/movies-service';
import { TrendingMoviesType } from '../../models/movie-response.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trending-section',
  imports: [MediaRow, CommonModule],
  templateUrl: './trending-section.html',
  styleUrl: './trending-section.scss',
})
export class TrendingSection implements OnInit {
  private readonly _moviesService = inject(MoviesService);
  moviesLoading = signal<boolean>(true);

  moviesList = signal<TrendingMoviesType[]>([]);
  moviesError = signal<boolean>(false);
  trendType: 'daily' | 'weekly' = 'daily';

  setTrend(type: 'daily' | 'weekly') {
    this.trendType = type;
    this.moviesLoading.set(true);
  }

  ngOnInit() {
    this._moviesService.fetchTrendingMovies().subscribe({
      next: (movies) => {
        this.moviesList.set(movies);
        this.moviesLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching trending movies:', err);
        this.moviesError.set(true);
        this.moviesLoading.set(false);
      },
    });
  }
}
