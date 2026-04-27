import { Component, input, signal } from '@angular/core';
import { RatedMediaList } from '../rated-media-list/rated-media-list';
import { RatedMediaModel } from '../../models/rated-media.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-display-ratings',
  imports: [RatedMediaList, RouterLink],
  templateUrl: './display-ratings.html',
  styleUrl: './display-ratings.scss',
})
export class DisplayRatings {
  watchStatus = input<string>();

  ratingList = signal<RatedMediaModel[] | null>(null);
}
