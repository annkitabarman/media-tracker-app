import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './components/nav-bar/nav-bar';
import { Store } from '@ngrx/store';
import { MoviesService } from './services/movies-service';
import { loadWatchlistSuccess } from './store/watchlist/watchlist.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly _store = inject(Store);
  private readonly _moviesService = inject(MoviesService);
  protected title = 'media-tracker';

  ngOnInit(): void {
    const watchlist = this._moviesService.fetchWatchlist();
    this._store.dispatch(loadWatchlistSuccess({ items: watchlist }));
  }
}
