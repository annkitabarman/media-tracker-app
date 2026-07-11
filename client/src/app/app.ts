import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './components/nav-bar/nav-bar';
import { Store } from '@ngrx/store';
import { MoviesService } from './services/movies-service';
import { loadLibrarySuccess } from './store/library/library.actions';
import { selectLibraryItems } from './store/library/library.selectors';
import { distinctUntilChanged } from 'rxjs';
import { ToastComponent } from './components/toast-component/toast-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly _store = inject(Store);
  private readonly _moviesService = inject(MoviesService);
  protected title = 'media-tracker';

  ngOnInit(): void {
    const watchlist = this._moviesService.fetchLibrary();
    this._store.dispatch(loadLibrarySuccess({ items: watchlist }));

    this._store
      .select(selectLibraryItems)
      .pipe(distinctUntilChanged())
      .subscribe((items) => {
        this._moviesService.saveLibrary(items);
      });
  }
}
