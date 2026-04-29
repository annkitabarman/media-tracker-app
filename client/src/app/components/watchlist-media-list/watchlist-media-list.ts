import { Component, input } from '@angular/core';
import { WatchlistMediaModel } from '../../models/watchlist-media.model';

@Component({
  selector: 'app-watchlist-media-list',
  imports: [],
  templateUrl: './watchlist-media-list.html',
  styleUrl: './watchlist-media-list.scss',
})
export class WatchlistMediaList {
  item = input<WatchlistMediaModel | null>(null);
}
