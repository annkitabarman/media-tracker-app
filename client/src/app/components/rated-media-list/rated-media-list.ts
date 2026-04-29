import { Component, input } from '@angular/core';
import { RatedMediaModel } from '../../models/rated-media.model';

@Component({
  selector: 'app-rated-media-list',
  imports: [],
  templateUrl: './rated-media-list.html',
  styleUrl: './rated-media-list.scss',
})
export class RatedMediaList {
  ratingDetail = input<RatedMediaModel | null>(null);
}
