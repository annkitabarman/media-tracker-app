import { Component, signal } from '@angular/core';
import { RatingsFilters } from '../ratings-filters/ratings-filters';
import { DisplayRatings } from '../display-ratings/display-ratings';

@Component({
  selector: 'app-ratings',
  imports: [RatingsFilters, DisplayRatings],
  templateUrl: './ratings.html',
  styleUrl: './ratings.scss',
})
export class Ratings {
  watchStatus = signal<string>('All');
  setWatchStatus(status: string) {
    this.watchStatus.set(status);
  }
}
