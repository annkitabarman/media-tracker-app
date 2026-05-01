import { Component, signal, inject, computed } from '@angular/core';
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
export class Watchlist {
  private readonly _store = inject(Store);
  appliedFilter = signal<Record<string, string>>({
    format: '',
    genre: '',
    year: '',
    sort: 'title',
    search: '',
  });
  updateSearch(s: string) {
    this.appliedFilter.update((prev) => ({
      ...prev,
      search: s.toLowerCase(),
    }));
  }

  allWatchlist = toSignal(this._store.select(selectWatchlistItems), {
    initialValue: [],
  });

  applyFilter(filter: Record<string, string>) {
    this.appliedFilter.set(filter);
  }

  filteredItems = computed(() => {
    const items = this.allWatchlist();
    const filters = this.appliedFilter();

    let result = [...items];

    if (filters['search']) {
      const search = filters['search'];
      result = result.filter((i) => i.name.toLowerCase().includes(search));
    }

    if (filters['genre']) {
      result = result.filter((i) => i.genre?.includes(filters['genre']));
    }

    if (filters['format']) {
      result = result.filter((i) => i.mediaType === filters['format']);
    }

    if (filters['year']) {
      result = result.filter((i) => i.year.startsWith(filters['year']));
    }

    switch (filters['sort']) {
      case 'title':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'date_added':
        result = [...result].sort(
          (a, b) =>
            new Date(a.dateAdded ?? 0).getTime() -
            new Date(b.dateAdded ?? 0).getTime(),
        );
        break;

      case 'release_date':
        result = [...result].sort(
          (a, b) =>
            new Date(a.year ?? 0).getTime() - new Date(b.year ?? 0).getTime(),
        );
        break;
    }

    return filters['sort_order'] === 'desc' ? [...result].reverse() : result;
  });
}
