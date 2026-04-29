import { Component, signal, inject, OnInit } from '@angular/core';
import { RatingsFilters } from '../ratings-filters/ratings-filters';
import { DisplayRatings } from '../display-ratings/display-ratings';
import { MoviesService } from '../../services/movies-service';
import { RatedMediaModel } from '../../models/rated-media.model';

@Component({
  selector: 'app-ratings',
  imports: [RatingsFilters, DisplayRatings],
  templateUrl: './ratings.html',
  styleUrl: './ratings.scss',
})
export class Ratings implements OnInit {
  private readonly _moviesService = inject(MoviesService);
  watchStatus = signal<string>('All');
  setWatchStatus(status: string) {
    this.watchStatus.set(status);
  }

  allRatingsList = signal<RatedMediaModel[] | null>(null);
  ngOnInit(): void {
    this._moviesService.fetchRatings().subscribe({
      next: (res) => {
        this.allRatingsList.set(res);
        console.log(res);
      },
    });
  }
}
