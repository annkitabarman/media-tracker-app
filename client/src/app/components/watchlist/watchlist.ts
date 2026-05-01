import { Component, signal, inject, OnInit } from '@angular/core';
import { UserFilters } from '../user-filters/user-filters';
import { DisplayWatchlist } from '../display-watchlist/display-watchlist';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectWatchlistItems } from '../../store/watchlist/watchlist.selectors';

@Component({
  selector: 'app-watchlist',
  imports: [UserFilters, DisplayWatchlist],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.scss',
})
export class Watchlist implements OnInit {
  private readonly _store = inject(Store);

  allWatchlist = toSignal(this._store.select(selectWatchlistItems), {
    initialValue: [],
  });

  ngOnInit(): void {}
}
