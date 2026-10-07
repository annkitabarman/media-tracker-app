import { Component, computed, inject, input, signal } from '@angular/core';
import { LibraryMediaModel } from '../../models/library-media.model';
import { DatePipe } from '@angular/common';
import { UpperCasePipe } from '@angular/common';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  removeFromLibrary,
  editStatus,
} from '../../store/library/library.actions';
import { LibraryTypes } from '../../constants/library.constants';

@Component({
  selector: 'app-library-media-list',
  imports: [DatePipe, UpperCasePipe, NgClass, RouterLink],
  templateUrl: './library-media-list.html',
  styleUrl: './library-media-list.scss',
})
export class LibraryMediaList {
  private readonly store = inject(Store);
  item = input<LibraryMediaModel | null>(null);
  isWatched = computed(() => {
    return this.item()?.watch_status.includes(LibraryTypes.Watched);
  });

  isFavorites = computed(() => {
    return this.item()?.watch_status.includes(LibraryTypes.Favorites);
  });

  toggleWatched() {
    this.addToLibrary();
  }

  get mediatype(): string | null {
    const data = this.item();
    if (data?.mediaType === 'movie') return 'Movie';
    else return 'TV Show';
  }
  currentYear = new Date().getFullYear();

  addToLibrary() {
    const data = this.item();
    if (!data) return;

    if (!this.isWatched()) {
      this.store.dispatch(
        editStatus({
          id: data.id,
          watch_status: LibraryTypes.Watched,
        }),
      );
    } else {
      this.store.dispatch(
        removeFromLibrary({
          id: data.id,
          watch_status: LibraryTypes.Watched,
        }),
      );
    }
  }

  toggleFavorites() {
    const data = this.item();
    if (!data) return;

    if (!this.isFavorites()) {
      this.store.dispatch(
        editStatus({
          id: data.id,
          watch_status: LibraryTypes.Favorites,
        }),
      );
    } else {
      this.store.dispatch(
        removeFromLibrary({
          id: data.id,
          watch_status: LibraryTypes.Favorites,
        }),
      );
    }
  }
}
