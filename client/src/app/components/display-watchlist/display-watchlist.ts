import { Component, input, signal } from '@angular/core';
import { WatchlistMediaList } from '../watchlist-media-list/watchlist-media-list';
import { WatchlistMediaModel } from '../../models/watchlist-media.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-display-watchlist',
  imports: [WatchlistMediaList, RouterLink],
  templateUrl: './display-watchlist.html',
  styleUrl: './display-watchlist.scss',
})
export class DisplayWatchlist {
  watchStatus = input<string>();

  watchList = input<WatchlistMediaModel[] | null>(null);
}
