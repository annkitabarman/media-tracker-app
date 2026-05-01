import { Component, input, signal } from '@angular/core';
import { WatchlistMediaModel } from '../../models/watchlist-media.model';
import { DatePipe } from '@angular/common';
import { UpperCasePipe } from '@angular/common';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-watchlist-media-list',
  imports: [DatePipe, UpperCasePipe, NgClass, RouterLink],
  templateUrl: './watchlist-media-list.html',
  styleUrl: './watchlist-media-list.scss',
})
export class WatchlistMediaList {
  item = input<WatchlistMediaModel | null>(null);
  markAsWatched = signal<boolean>(false);

  toggleWatched() {
    this.markAsWatched.set(!this.markAsWatched());
  }

  get mediatype(): string | null {
    const data = this.item();
    if (data?.mediaType === 'movie') return 'Movie';
    else return 'TV Show';
  }
  currentYear = new Date().getFullYear();
}
