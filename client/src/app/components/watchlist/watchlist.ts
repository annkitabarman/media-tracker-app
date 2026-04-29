import { Component, signal, inject, OnInit } from '@angular/core';
import { RatingsFilters } from '../ratings-filters/ratings-filters';
import { DisplayWatchlist } from '../display-watchlist/display-watchlist';
import { MoviesService } from '../../services/movies-service';
import { WatchlistMediaModel } from '../../models/watchlist-media.model';
import { Store } from '@ngrx/store';
import {
  loadWatchlistFailure,
  loadWatchlistSuccess,
} from '../../store/watchlist/watchlist.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectWatchlistItems } from '../../store/watchlist/watchlist.selectors';

@Component({
  selector: 'app-watchlist',
  imports: [RatingsFilters, DisplayWatchlist],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.scss',
})
export class Watchlist implements OnInit {
  private readonly _store = inject(Store);
  private readonly _moviesService = inject(MoviesService);
  watchStatus = signal<string>('All');
  setWatchStatus(status: string) {
    this.watchStatus.set(status);
  }

  allWatchlist = toSignal(this._store.select(selectWatchlistItems), {
    initialValue: [],
  });

  ngOnInit(): void {
    const watchlist = this._moviesService.fetchWatchlist();
    if (!watchlist)
      this._store.dispatch(
        loadWatchlistFailure({ error: 'Unable to load data!' }),
      );
    this._store.dispatch(loadWatchlistSuccess({ items: watchlist }));
  }
}
