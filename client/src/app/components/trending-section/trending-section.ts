import { Component, inject, signal, OnInit } from '@angular/core';
import { MediaRow } from '../media-row/media-row';
import { MoviesService } from '../../services/movies-service';
import { TrendingMoviesType } from '../../models/movie-response.model';

@Component({
  selector: 'app-trending-section',
  imports: [MediaRow],
  templateUrl: './trending-section.html',
  styleUrl: './trending-section.scss',
})
export class TrendingSection implements OnInit {
  private readonly _moviesService = inject(MoviesService);
  moviesLoading = signal<boolean>(true);

  moviesList = signal<TrendingMoviesType[]>([]);
  moviesError = signal<boolean>(false);

  ngOnInit() {
    this._moviesService.fetchTrendingMovies().subscribe(
      (res) => {
        this.moviesList.set(res);
        this.moviesLoading.set(false);
      },
      (err) => {
        console.error('Error fetching trending movies:', err);
        this.moviesError.set(true);
        this.moviesLoading.set(false);
      },
    );
  }
}
