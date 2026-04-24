import { Component } from '@angular/core';
import { RatingsFilters } from '../ratings-filters/ratings-filters';
import { RatedMedia } from '../rated-media/rated-media';

@Component({
  selector: 'app-ratings',
  imports: [RatingsFilters, RatedMedia],
  templateUrl: './ratings.html',
  styleUrl: './ratings.scss',
})
export class Ratings {}
